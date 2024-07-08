function parseCourseDescription(description) {
    const result = {
      lowerBound: [],
      upperBound: [],
      codes: []
    };
  
    const codeRegex = /([A-Z]+)\s-?/g;
    let match;
    while ((match = codeRegex.exec(description)) !== null) {
      result.codes.push(match[1]);
    }
  
    const rangeRegex = /(\d{3})-?(\d{3})?/g;
    while ((match = rangeRegex.exec(description)) !== null) {
      result.lowerBound.push(parseInt(match[1]));
      if (match[2]) {
        result.upperBound.push(parseInt(match[2]));
      } else {
        result.upperBound.push(parseInt(match[1]) + 99);
      }
    }

    return result;
  }
  
  // Test cases
  let test1 = "Two 400-level STAT courses";
  let test2 = "One additional 300- or 400-level STAT course";
  let test3 = "Three additional 400-level PMATH courses (1.5 units)";
  let test4 = "One 300- or 400-level AMATH course";
  let test6 = "One additional CS course chosen from CS 340-CS 398, CS 440-CS 489";

  console.log(parseCourseDescription(test1));
  console.log(parseCourseDescription(test2));
  console.log(parseCourseDescription(test3));
  console.log(parseCourseDescription(test4));
  console.log(parseCourseDescription(test6));