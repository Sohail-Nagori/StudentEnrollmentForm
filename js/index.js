var jpdbBaseURL='http://api.login2explore.com:5577';
var jpdbIRL='/api/irl';
var jpdbIML='/api/iml';
var studentDBName='SCHOOL-DB';
var studentRelationName='STUDENT-TABLE';
var connectionToken='90931371|-31949321226603417|90950266';


function getStudentIdAsJsonObject()
{
var rollNumber=document.getElementById('rollNumber');
var rl=rollNumber.value.trim();
var jsonStr={
    rollNo:rl
};
return JSON.stringify(jsonStr);
}


function saveRecNoToLocalStorage(jsonObject)
{
var lvdata=JSON.parse(jsonObject.data);    
localStorage.setItem('recno',lvdata.rec_no);
}


function fillData(jsonObject)
{
saveRecNoToLocalStorage(jsonObject);
var record=JSON.parse(jsonObject.data).record;
document.getElementById('studentName').value=record.name;
document.getElementById('studentClass').value=record.section;
document.getElementById('studentAddress').value=record.address;
document.getElementById('studentDOB').value=record.dob;
document.getElementById('enrollmentDate').value=record.enrollmentDATE;
}

function resetStudent()
{
document.getElementById('rollNumber').value='';
document.getElementById('studentName').value='';
document.getElementById('studentClass').value='';
document.getElementById('studentAddress').value='';
document.getElementById('studentDOB').value='';
document.getElementById('enrollmentDate').value='';    
document.getElementById('rollNumber').disabled=false;
document.getElementById('rollNumber').focus();
document.getElementById('studentSave').disabled=true;
document.getElementById('studentUpdate').disabled=true;
document.getElementById('studentReset').disabled=true;
}

function validateData()
{
var rollNumber=document.getElementById('rollNumber').value.trim();
var studentName=document.getElementById('studentName').value.trim();
var studentClass=document.getElementById('studentClass').value.trim();
var studentAddress=document.getElementById('studentAddress').value.trim();
var studentDOB=document.getElementById('studentDOB').value;
var enrollmentDate=document.getElementById('enrollmentDate').value;
if(rollNumber==='')
{
alert('Roll number required');    
document.getElementById('rollNumber').focus();
return '';
}
if(isNaN(rollNumber))
{
alert('Invalid roll number '+rollNumber);    
document.getElementById('rollNumber').focus();
return '';
}
if(studentName==='')
{
alert('Name required');    
document.getElementById('studentName').focus();
return '';
}
if(studentClass==='')
{
alert('Class required');    
document.getElementById('studentClass').focus();
return '';
}
if(studentAddress==='')
{
alert('Address required');    
document.getElementById('studentAddress').focus();
return '';
}
if(studentDOB==='')
{
alert('DOB required');    
document.getElementById('studentDOB').focus();
return '';
}
if(enrollmentDate==='')
{
alert('Enrollment date required');    
document.getElementById('enrollmentDate').focus();
return '';
}
var jsonStrObj={
rollNo:rollNumber,
name:studentName,
dob:studentDOB,
address:studentAddress,
section:studentClass,
enrollmentDATE:enrollmentDate
};
return JSON.stringify(jsonStrObj);
}



function saveStudent()
{
var jsonStrObject=validateData();    
if(jsonStrObject==='')return;
var putRequest=createPUTRequest(connectionToken,jsonStrObject,studentDBName,studentRelationName);
jQuery.ajaxSetup({async:false});
var resJsonObject=executeCommandAtGivenBaseUrl(putRequest,jpdbBaseURL,jpdbIML);
jQuery.ajaxSetup({async:true});
resetStudent();
}

function updateStudent()
{
document.getElementById('studentUpdate').disabled=true;
var jsonStrObject=validateData();    
if(jsonStrObject==='')
{
document.getElementById('studentUpdate').disabled=false;
return;
}
var updateRequest=createUPDATERecordRequest(connectionToken,jsonStrObject,studentDBName,studentRelationName,localStorage.getItem('recno'));
jQuery.ajaxSetup({async:false});
var resJsonObject=executeCommandAtGivenBaseUrl(updateRequest,jpdbBaseURL,jpdbIML);
jQuery.ajaxSetup({async:true});
resetStudent();
}




function getStudent()
{
var studentRollNumber=getStudentIdAsJsonObject();
var getRequest=createGET_BY_KEYRequest(connectionToken,studentDBName,studentRelationName,studentRollNumber);
jQuery.ajaxSetup({async: false});
var resJsonObject=executeCommandAtGivenBaseUrl(getRequest,jpdbBaseURL,jpdbIRL);
jQuery.ajaxSetup({async: true});
if(resJsonObject.status===400)
{
document.getElementById('studentSave').disabled=false;
document.getElementById('studentReset').disabled=false;
document.getElementById('studentName').focus();
}
else if(resJsonObject.status===200)
{
document.getElementById('rollNumber').disabled=true;
fillData(resJsonObject);
document.getElementById('studentUpdate').disabled=false;
document.getElementById('studentReset').disabled=false;
document.getElementById('studentName').focus();
}
}