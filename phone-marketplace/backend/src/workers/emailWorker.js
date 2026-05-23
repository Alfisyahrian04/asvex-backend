const Queue =
require('bull');

const emailQueue =
new Queue('email');

emailQueue.process(
async(job)=>{

console.log(
'Sending email:',
job.data
);

});
