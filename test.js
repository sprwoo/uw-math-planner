// const FormData = require('form-data');
// const fs = require('fs');

// const url = 'https://g1t9swar0l.execute-api.us-east-2.amazonaws.com/dev/math-undergraduate-calendar/testupload';
// const filePath = 'CSVs/course_info.csv';

// async function uploadFile() {
//     const formData = new FormData();
//     formData.append('file', fs.createReadStream(filePath));

//     try {
//         const fetch = (await import('node-fetch')).default;

//         const response = await fetch(url, {
//             method: 'PUT',
//             headers: {
//             },
//             body: formData
//         });

//         const contentType = response.headers.get('content-type');

//         if (response.ok) {
//             if (contentType && contentType.includes('application/json')) {
//                 const responseData = await response.json();
//                 console.log('Success:', responseData);
//             } else {
//                 const textData = await response.text();
//                 console.log('Success (non-JSON):', textData);
//             }
//         } else {
//             const errorText = await response.text();
//             console.error('Error:', response.status, errorText);
//         }
//     } catch (error) {
//         console.error('Fetch error:', error);
//     }
// }

// uploadFile();
