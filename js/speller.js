export default {
	check,
	lookup,
};

var elements;
var symbols = {};

await loadPeriodicTable();


// ****************************

async function loadPeriodicTable() {
	elements = await (await fetch("periodic-table.json")).json();
	console.log(elements);
	for (let element of elements) {
		symbols[element.symbol.toLowerCase()] = element;
	}
}

function lookup(elementSymbol) {
	// TODO: return the element entry based on specified
	// symbol (case-insensitive)
	// for (let element of elements) {
	// 	if (element.symbol.toLowerCase() === elementSymbol) {
	// 		return element;
	// 	}
	// }
	// return {};
	return symbols[elementSymbol.toLowerCase()];
}

function check(inputWord) {
	// TODO: determine if `inputWord` can be spelled
	// with periodic table symbols; return array with
	// them if so (empty array otherwise)
	class TreeNode {
		constructor(word = null, path = []) {
			console.log('path: ', path);
			this.word = word;
			this.path = path;
			console.log('this.path: ', this.path);
			this.children = [null, null];
			let oneLtrSymbol = null;
			let twoLtrSymbol = null;
			if (lookup(word.slice(0,2))) {
				twoLtrSymbol = lookup(word.slice(0,2)).symbol;
			}
			this.twoLtrSybmol = twoLtrSymbol;
			if (lookup(word.slice(0,1))) {
				oneLtrSymbol = lookup(word.slice(0,1)).symbol;
			}
			this.oneLtrSymbol = oneLtrSymbol;
			if (twoLtrSymbol && word.length >= 2) {
				this.children[0] = new TreeNode(word.slice(2), path.concat([twoLtrSymbol]));
			}
			if (oneLtrSymbol && word.length >= 1) {
				this.children[1] = new TreeNode(word.slice(1), path.concat([oneLtrSymbol]));
			}
		}
	}

	class Tree {
		constructor(word) {
			this.root = new TreeNode(word);
		}

		findFirstSolution(currentNode = this.root, inputWord = this.root.word) {
			console.log('currentNode.children: ', currentNode.children)
			for (let child in currentNode.children) {
				console.log('child: ', child)
				// base case
				// solution found
				if (child.path.join('') === inputWord) {
					return child.path;
				// no solution in current branch; try another branch
				} else if (child === null) {
					return;
				// recurse
				} else {
					return findFirstSolution(child)
				}
			}
		}

		findSolution() {
			//traverseTree to assemble word
			let traverseTree = (currentNode) => {
				// console.log('currentNode: ', currentNode);
				// base case
				if (currentNode.symbol2 !== null && currentNode.word.length === currentNode.symbol2.length) {
					// success
					return [currentNode.symbol2];
				} else if (currentNode.symbol1 !== null && currentNode.word.length === currentNode.symbol1.length) {
					return [currentNode.symbol1]
					// failure - look for a different solution.
				} else if (this.root.children.length === 0) {
					return [];
				}

				// non-base case
				let result = [];
				if (currentNode.symbol2 !== null && currentNode.word.length > 2) {
					result = [currentNode.symbol2];
					result = result.concat(traverseTree(currentNode.children[0]))
				} else if (currentNode.symbol1 !== null && currentNode.word.length > 1) {
					result = [currentNode.symbol1];
					result = result.concat(traverseTree(currentNode.children[1]))
				}
				return result;
			}
			return traverseTree(this.root)
		}

		findASolution() {
			// Solution 1:  recursive favoring 2 letter symbols over one.  Does not work for "pancreas".
			let result = [];

			if (lookup(inputWord.slice(0,2)).symbol) {
				result = [lookup(inputWord.slice(0,2)).symbol.toLowerCase()];
			} else if (lookup(inputWord.slice(0,1)).symbol) {
				result = [lookup(inputWord.slice(0,1)).symbol.toLowerCase()];
			}

			console.log('result: ', result);

			// base case
			if (result.join('').length === inputWord.length) {
				return result;
			} else if (result.length === 0) {
				return [];
			}

			// non-base case
			let answer = result.concat(check(inputWord.slice(result[0].length)))
			console.log('answer: ', answer);
			if (answer.join('').length === inputWord.length) {
				return answer;
			} else {
				return [];
			}
		}
	}
	console.log('inputWord: ', inputWord)
	let resultTree = new Tree(inputWord);
	console.log('resultTree: ', resultTree);
	return [];
}