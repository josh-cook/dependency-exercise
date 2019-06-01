function jobsToPairs(jobsList) {
  let lines = jobsList.split("\n");
  let pairs = [];

  for (let i = 0; i < lines.length; i++) {
    let pair = lines[i].split(/ => ?/);
    if (pair[0] === pair[1]) {
      throw new Error("Cyclic Dependency Detected");
    }
    pairs.push(pair);
  }

  return pairs;
}

function findJobsWithoutDependents(pairs) {
  // pairs [["a", "b"], ["b", "c"]] etc

  return pairs
    .filter(currentJob => {
      const hasDependents = pairs.some(
        otherJob => otherJob[1] === currentJob[0]
      );
      return !hasDependents;
    })
    .map(pair => pair[0]);
}

function jobs(jobsList) {
  if (!jobsList) {
    return [];
  }

  const pairs = jobsToPairs(jobsList);

  // L ← Empty list that will contain the sorted elements
  let sorted = [];

  // S ← Set of all nodes with no incoming edge
  let queue = findJobsWithoutDependents(pairs);

  // while S is non-empty do
  while (queue.length !== 0) {
    // remove a node n from S
    let jobName = queue.pop();

    // add n to tail of L
    sorted.push(jobName);

    let job = pairs.find(job => job[0] === jobName);

    // if node n has a dependency m
    if (job[1].length) {
      // insert m into S
      queue.push(job[1]);
    }
  }

  if (sorted.length !== pairs.length) {
    throw new Error("Circular Dependency Detected");
  }

  return sorted.reverse();
}

module.exports = jobs;
