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

	let result = [];

	if (lookup(inputWord.slice(0,2)).symbol) {
		result = [lookup(inputWord.slice(0,2)).symbol.toLowerCase()]
	} else if (lookup(inputWord.slice(0,1)).symbol) {
		result = [lookup(inputWord.slice(0,1)).symbol.toLowerCase()]
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
	return answer;
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
