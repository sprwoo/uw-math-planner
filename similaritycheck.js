// Parse both req1 and req2 requirements to turn it into a dictionary
// Iterate through req1 to map each course into its own key, with the major name as a value
// Then iterate through req2, adding the major name to existing keys

const major1 = {
    Year: '2023-2024',
    Major: 'Joint Pure Mathematics',
    Link: 'https://academic-calendar-archive.uwaterloo.ca/undergraduate-studies/2023-2024/page/MATH-Joint-Pure-Mathematics1.html',
    Requirements: "{'1. One of': ['MATH 237 Calculus 3 for Honours Mathematics', 'MATH 247 Calculus 3 (Advanced Level)'], '2. One of': ['AMATH 331/PMATH 331 Applied Real Analysis', 'PMATH 333 Introduction to Real Analysis', 'PMATH 351 Real Analysis'], '3. One of': ['AMATH 332/PMATH 332 Applied Complex Analysis', 'PMATH 352 Complex Analysis'], '4. One of': ['MATH 239 Introduction to Combinatorics', 'MATH 249 Introduction to Combinatorics (Advanced Level)', 'An additional PMATH course'], '5. Two of': ['PMATH 334 Introduction to Rings and Fields with Applications', 'PMATH 336 Introduction to Group Theory with Applications', 'PMATH 347 Groups and Rings', 'PMATH 348 Fields and Galois Theory'], '6. Three additional PMATH courses': []}"
}

const major2 = {
    Year: '2023-2024',
    Major: 'Joint Combinatorics and Optimization',
    Link: 'https://academic-calendar-archive.uwaterloo.ca/undergraduate-studies/2023-2024/page/MATH-Joint-Combinatorics-and-Optimization1.html',
    Requirements: "{'1. One of': ['MATH 239 Introduction to Combinatorics', 'MATH 249 Introduction to Combinatorics (Advanced Level)'], '2. One of': ['CO 250 Introduction to Optimization', 'CO 255 Introduction to Optimization (Advanced Level)'], '3. One of': ['PMATH 336 Introduction to Group Theory with Applications', 'PMATH 347 Groups and Rings'], '4. Four of': ['CO 330 Combinatorial Enumeration', 'CO 331 Coding Theory', 'CO 342 Introduction to Graph Theory', 'CO 351 Network Flow Theory', 'CO 353 Computational Discrete Optimization', 'CO 367 Nonlinear Optimization', 'CO 430 Algebraic Enumeration', 'CO 431 Symmetric Functions', 'CO 432 Information Theory and Applications', 'CO 434 Combinatorial Designs', 'CO 439 Topics in Combinatorics', 'CO 440 Topics in Graph Theory', 'CO 442 Graph Theory', 'CO 444 Algebraic Graph Theory', 'CO 446 Matroid Theory', 'CO 450 Combinatorial Optimization', 'CO 452 Integer Programming', 'CO 454 Scheduling', 'CO 456 Introduction to Game Theory', 'CO 459 Topics in Optimization', 'CO 463 Convex Optimization and Analysis', 'CO 466 Continuous Optimization', 'CO 471 Semidefinite Optimization', 'CO 481/CS 467/PHYS 467 Introduction to Quantum Information Processing', 'CO 485 The Mathematics of Public-Key Cryptography', 'CO 486 Topics in Quantum Information', 'CO 487 Applied Cryptography'], '5. Three of': ['AMATH 331/PMATH 331 Applied Real Analysis or PMATH 333 Introduction to Real Analysis', 'AMATH 332/PMATH 332 Applied Complex Analysis', 'CS 341 Algorithms', 'CS 360 Introduction to the Theory of Computing', 'CS 466 Algorithm Design and Analysis', 'MATH 237 Calculus 3 for Honours Mathematics or MATH 247 Calculus 3 (Advanced Level)', 'PMATH 334 Introduction to Rings and Fields with Applications or PMATH 348 Fields and Galois Theory', 'PMATH 340 Elementary Number Theory']}"
}

function add_to_dict(object, key, name) {
    key = key.trim();
    key = key.slice(1, -1);
    if (key.length > 0) {
        if (Array.isArray(object[key])) {
            object[key].push(name);
        } else {
            object[key] = [name];
        }
    }
}

function parse_csv_to_obj(major, requirements) {
    let values = false;
    let key = "";

    for (let i = 0; i < major.Requirements.length; i++) {
        let ch = major.Requirements[i];
        if (ch == '[') {
            values = true;
        } else if (ch == ']') {
            add_to_dict(requirements, key, major.Major);
            values = false;
            key = "";
        } else if (ch == ',' && values) {
            add_to_dict(requirements, key, major.Major);
            key = "";
        } else if (values) {
            key += ch;
        } 
    }
}

var requirements = {};
parse_csv_to_obj(major1, requirements);
parse_csv_to_obj(major2, requirements);

for (let key in requirements) {
    if (requirements[key].length < 2) {
        delete requirements[key];
    }
}

console.log(requirements)