const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const timestamp = value => typeof value === 'string' && /^\d+\.\d+$/.test(value);
function httpsLink(value) {
  if (!nonempty(value) || !/^https:\/\//i.test(value) || /[\s\\]/.test(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !!url.hostname && !url.username && !url.password;
  } catch { return false; }
}

export function freezeSource(trigger, configuredChannel) {
  if (!nonempty(configuredChannel) || trigger?.source_channel_id !== configuredChannel ||
      !timestamp(trigger.message_ts) ||
      (trigger.thread_ts !== undefined && trigger.thread_ts !== '' && !timestamp(trigger.thread_ts))) {
    throw new Error('Invalid or mismatched source coordinates');
  }
  return Object.freeze({channel: configuredChannel, thread_ts: trigger.thread_ts || trigger.message_ts});
}

export function preflight(source, parent) {
  return !!(source && nonempty(source.channel) && timestamp(source.thread_ts) &&
    parent && parent.channel === source.channel && parent.ts === source.thread_ts &&
    parent.exists === true && parent.deleted === false && parent.accessible === true);
}

export function replyEnvelope(source, parent, text) {
  if (!preflight(source, parent) || !nonempty(text)) throw new Error('Thread reply preflight failed');
  return Object.freeze({channel: source.channel, thread_ts: source.thread_ts, text});
}

export function trustedVerdict(source, message, identity, markers = {
  bug: '[benny:bug]', performance: '[benny:performance]', other: '[benny:other]',
}) {
  if (!nonempty(identity) || message?.user !== identity || message.channel !== source.channel ||
      message.thread_ts !== source.thread_ts || message.ts === source.thread_ts ||
      !timestamp(message.ts) || typeof message.text !== 'string') return null;
  const entries = Object.entries(markers);
  if (entries.length !== 3 || !['bug','performance','other'].every(k => nonempty(markers[k])) ||
      new Set(Object.values(markers)).size !== 3) return null;
  const occurrences = entries.flatMap(([kind, marker]) => {
    const found = []; let offset = 0, index;
    while ((index = message.text.indexOf(marker, offset)) !== -1) {
      found.push({kind, marker, index}); offset = index + marker.length;
    }
    return found;
  });
  if (occurrences.length !== 1) return null;
  const {kind, marker} = occurrences[0];
  const line = message.text.trim().split(/\r?\n/).at(-1);
  if (line !== marker && !line.startsWith(marker + ' tracker=')) return null;
  let tracker = null;
  if (line !== marker) {
    if (kind === 'other') return null;
    try { const url = new URL(line.slice((marker + ' tracker=').length));
      if (url.protocol !== 'https:' || url.username || url.password || /\s/.test(line.slice(marker.length + 9))) return null;
      tracker = url.href;
    } catch { return null; }
  }
  return Object.freeze({kind, proceed: kind !== 'other', tracker});
}

export function claimKey(source, workflow) {
  if (!['triage','reproduce'].includes(workflow) || !nonempty(source?.channel) || !timestamp(source?.thread_ts)) {
    throw new Error('Invalid claim');
  }
  return JSON.stringify([workflow, source.channel, source.thread_ts]);
}

export function claimOnce(claims, source, workflow) {
  const key = claimKey(source, workflow);
  if (claims.has(key)) return false;
  claims.add(key);
  return true;
}

export function ticketGate({sourceValid, sourcePermalink, targetResolved, compensationAvailable,
  category, clearlyBroken, stillLive, duplicate}) {
  return sourceValid === true && httpsLink(sourcePermalink) && targetResolved === true &&
    compensationAvailable === true && ['bug','performance'].includes(category) &&
    clearlyBroken === true && stillLive === true && duplicate === 'none';
}

export function handoffOutcome({createdIssue, replyVerified, compensationVerified}) {
  if (replyVerified === true) return Object.freeze({action:'complete', success:true});
  if (!nonempty(createdIssue)) return Object.freeze({action:'stop-no-root-retry', success:false});
  if (compensationVerified === true) return Object.freeze({action:'compensated', success:false});
  return Object.freeze({action:'compensate-and-verify', issue:createdIssue, success:false});
}

export function draftGate(evidence) {
  const e=evidence ?? {};
  return Number.isInteger(e.baselineReproductions) && e.baselineReproductions >= 2 &&
    Number.isInteger(e.patchedSuccesses) && e.patchedSuccesses >= 2 &&
    ['realUI','independentAttempts','mediaConfirmed','beforeCapture','afterCapture','stateCrossCheck',
      'rootCauseConfirmed','withinBudget','rejectionWindowClosed','focusedTestsPassed',
      'blastRadiusPassed','requiredChecksPassed','diffReviewed'].every(key=>e[key]===true) &&
    e.existingFix === false && e.humanOwnsFix === false && e.regressionRemaining === false;
}

export function workerRoute({wantsCode, toolsExcludeSlackWrites, credentialsExcludeSlack}) {
  if (toolsExcludeSlackWrites !== true || credentialsExcludeSlack !== true) return 'coordinator';
  return wantsCode === true ? 'isolated-code-worker' : 'isolated-read-only-worker';
}
