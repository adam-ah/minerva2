var facts = [];

function stringToDict(s) {
    dict = {}

    sarr = s.split(' ');

    sarr.forEach(piece => {
        var value = 1;
        if (piece.startsWith('-')) {
            value = -1;
            piece = piece.substring(1);
        }

        dict[piece] = value;
    });

    return dict;
}

function addString(s) {
    add(stringToDict(s));
}

function add(dict) {
    facts.push(dict);
}

function queryString(s) {
    return query(stringToDict(s));
}

function query(dict) {
    let response = {}
    let intensity = 0;

    facts.forEach(fact => {
        let featureSet = new Set(Object.keys(fact));
        for (var key in dict) {
            featureSet.add(key);
        }

        let count = featureSet.size;
        // console.log(fact);
        // console.log(count);

        var sum = 0;
        for (var key in dict) {
            if (key in fact) {
                sum += fact[key] * dict[key];
            }
        }

        let activation = Math.pow(sum / count, 3);
        intensity += activation;
        // console.log(activation);

        if (activation != 0) {
            for (var key in fact) {
                if (!(key in response)) {
                    response[key] = 0;
                }

                response[key] += activation * fact[key];
            }
        }
    });

    let maxelement = Math.max(...Object.values(response));

    for (var key in response) {
        response[key] /= maxelement;
    }

    return { 'content': response, 'intensity': intensity };
}

function queryIterative(s) {
    var dictPrev = queryString(s);

    var maxIterations = 100;

    while (maxIterations--) {
        var dictCurr = query(dictPrev.content);
        if (JSON.stringify(dictCurr) == JSON.stringify(dictPrev)) {
            break;
        }
        dictPrev = dictCurr;
    }

    return dictPrev;
}

function sortPrint(response) {
    const content = response.content;

    var items = Object.keys(content).map(function (key) {
        return [key, content[key]];
    });

    // Sort the array based on the second element
    items.sort(function (first, second) {
        return second[1] - first[1];
    });

    return { 'intensity': response.intensity, 'content': items };
}

// add({ 'a': 1, 'b': -1 });
// addString("d -e");

addString("a -c -d -e");
addString("a b c -e");
addString("b c -d");

console.log(queryString("a b"));

// addString("type:animal type:horse type:friesian color:black small intelligent hair:long -strong")
// addString("type:animal type:horse type:belgian large heavy strong")
// addString("type:horse herbivore")
// addString("type:cat carnivore")
// addString("type:animal type:rat small color:white intelligent type:rodent")
// addString("type:animal type:rabbit -intelligent type:rodent")
// addString("type:animal type:bird type:canary color:yellow sing small")
// addString("type:apple type:fruit")
// addString("type:apple sweet sour -bitter")
// addString("type:apple color:red")
// addString("type:apple color:yellow")
// addString("type:fruit type:orange color:orange sweet sour")
// addString("type:fruit type:pear color:yellow sweet -sour")
// addString("type:fruit type:cranberry color:red sour bitter small")
// addString("type:fruit type:watermelon color:red color:green sweet sour -small")
// addString("type:vegetable type:spinach color:green")
// addString("type:vegetable type:chilli color:red strong")

// console.log(sortPrint(queryString("type:animal")))
// console.log(sortPrint(queryString("type:fruit color:yellow")));
// console.log(sortPrint(queryString("sweet")));
// console.log(sortPrint(queryString("color:yellow")));
// console.log(sortPrint(queryString("color:red")));
// console.log(sortPrint(queryString("strong")));
// console.log(sortPrint(queryIterative("herbivore")));