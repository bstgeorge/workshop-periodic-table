export default {
	check,
	lookup,
};

var elements;

await loadPeriodicTable();


// ****************************

async function loadPeriodicTable() {
	elements = await (await fetch("periodic-table.json")).json();
}

function check(inputWord) {
	// TODO: determine if `inputWord` can be spelled
	// with periodic table symbols; return array with
	// them if so (empty array otherwise)
	console.log('inputWord: ', inputWord)

	// Solution 2:  Build tree with 2-letter or 1-letter option that satisifes

	class TreeNode {
		constructor(word = null) {
			this.word = word;
			this.children = [null, null];
			if (lookup(word.slice(0,2)).symbol) {
				this.symbol2 = lookup(word.slice(0,2)).symbol.toLowerCase();
				if (word.slice(2).length >= 0) {
					this.children[0] = new TreeNode(word.slice(2));
				}
			} else {
				this.symbol2 = null;
			}
			if (lookup(word.slice(0,1)).symbol) {
				this.symbol1 = lookup(word.slice(0,1)).symbol.toLowerCase();
				if (word.slice(1).length >= 0) {
					this.children[1] = new TreeNode(word.slice(1));
				}
			} else {
				this.symbol1 = null;
			}
		}
	}

	class Tree {
		constructor(word) {
			this.root = new TreeNode(word);
		}
		findSolution() {
			//traverseTree to assemble word
			let traverseTree = (currentNode) => {
				let result = [currentNode.symbol2] || [currentNode.symbol1] || [];
				console.log('currentNode: ', currentNode);
				// base case
				if (currentNode.word.length === 0) {
					// success
					return '';
					// failure
				} else if (this.root.children.length === 0) {
					return '';
				}

				// non-base case
				if (currentNode.symbol2) {
					result = result.concat(traverseTree(currentNode.children[0]))
				} else if (currentNode.symbol1) {
					result = result.concat(traverseTree(currentNode.children[1]))
				}
				console.log('result: ', result)
				return result;
			}
			return traverseTree(this.root)
		}
	}

	let resultTree = new Tree(inputWord);
	console.log('resultTree: ', resultTree);
	console.log('resultTree.findSolution: ', resultTree.findSolution());
	return [];


	// Solution 1:  recursive favoring 2 letter symbols over one.  Does not work for "pancreas".
	// let result = [];

	// if (lookup(inputWord.slice(0,2)).symbol) {
	// 	result = [lookup(inputWord.slice(0,2)).symbol.toLowerCase()];
	// } else if (lookup(inputWord.slice(0,1)).symbol) {
	// 	result = [lookup(inputWord.slice(0,1)).symbol.toLowerCase()];
	// }

	// console.log('result: ', result);

	// // base case
	// if (result.join('').length === inputWord.length) {
	// 	return result;
	// } else if (result.length === 0) {
	// 	return [];
	// }

	// // non-base case
	// let answer = result.concat(check(inputWord.slice(result[0].length)))
	// console.log('answer: ', answer);
	// if (answer.join('').length === inputWord.length) {
	// 	return answer;
	// } else {
	// 	return [];
	// }
}

function lookup(elementSymbol) {
	// TODO: return the element entry based on specified
	// symbol (case-insensitive)
	for (let element of elements) {
		if (element.symbol.toLowerCase() === elementSymbol) {
			return element;
		}
	}
	return {};
}
