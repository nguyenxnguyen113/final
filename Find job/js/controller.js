const controller = {
  loadedCompany: false,
  loadedJob: false
}

const user = firebase.auth().currentUser;
const db = firebase.firestore();
const storage = firebase.storage();

controller.register = async function (registerInfo) {

  let email = registerInfo.email
  let password = registerInfo.password
  let displayName = registerInfo.fullname
 
  view.setText('register-error', '')
  view.setText('register-success', '')
  view.disable('btn-register')
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password)
    await firebase.auth().currentUser.updateProfile({
      displayName: displayName,
      email: email,
      password: password
    })
    addUser(firebase.auth().currentUser)

    await firebase.auth().currentUser.sendEmailVerification()
    view.setText('register-success', 'An email verification has been sended to your email address!')
  } catch (err) {
    view.setText('register-error', err.message)
  }
  view.enable('btn-register')
}


controller.logIn = async function (logInInfo) {

  try {
    view.disable('btn-login')
    let email = logInInfo.email
    let password = logInInfo.password
    let user = await firebase.firestore().collection('users').where("email", "==", email).get()
    let u = transformDocs(user.docs)
    console.log(u)
    console.log(u[0].role)
    if (u[0].role === 'user') {
      result = await firebase.auth().signInWithEmailAndPassword(email, password)
    } else {
      alert('oke')
    }
    
    console.log(result)
    if (!result.user.emailVerified) {
      throw new Error('You must verify email!')
    }

   if(view.pastScreen){
     view.showComponents(view.pastScreen)
   }else{
     view.showComponents('home')
    }

  } catch (err) {
    view.setText('log-in-error', err.message)
    view.enable('btn-login')
  }
}
//
controller.loginEmployer = async function (logInInfo) {
  try {
    let email = logInInfo.email
    let password = logInInfo.password
    let user = await firebase.firestore().collection('company').where("emailCompany", "==", email).get()
    let u = transformDocs(user.docs)
    console.log(u)
    console.log(u[0].role)
    if (u[0].role === 'employer') {
      result = await firebase.auth().signInWithEmailAndPassword(email, password)
    } else {
      alert('oke')
    }
    
    console.log(result)
    if (!result.user.emailVerified) {
      throw new Error('You must verify email!')
    }
    view.showComponents('employerScreen')
  } catch (error) {
    view.setText('log-in-error', error.message)
  }
}
// function to add user to the database
let addUser = async function (user) {
  if (user != null) {
    db.collection("users").doc(user.email).set({
      email: user.email,
      displayName: user.displayName,
      role: 'user'
    })
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  }
}
//regist to become employer
controller.registCompany = async function (registerInfo) {

  let email = registerInfo.email
  let password = registerInfo.password
  let displayName = registerInfo.fullname
  let nameCompany = registerInfo.nameCompany
  let addressCompany = registerInfo.addressCompany
  let titleCompany = registerInfo.titleCompany
  addCompany(registerInfo)
  view.setText('register-error', '')
  view.setText('register-success', '')
  view.disable('btn-register')
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password)
    firebase.auth().currentUser.updateProfile({
      displayName: displayName,
      email: email,
      password: password
    })
    await firebase.auth().currentUser.sendEmailVerification()
    view.setText('register-success', 'An email verification has been sended to your email address!')
  } catch (err) {
    view.setText('register-error', err.message)
  }
  view.enable('btn-register')
}

// function to add company to the database
const addCompany = async function (user) {
  if (user != null) {
    db.collection("company").doc().set({
      emailCompany: user.email,
      employee: user.fullname,
      title: user.titleCompany,
      name: user.nameCompany,
      address: user.addressCompany,
      role: 'employer',
      status: 'block'
    })
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  }
}
// function to fill the existing profile page (default user profile)
controller.fillProfilePage = async function () {
  let currentUser = firebase.auth().currentUser
  db.collection('users').doc(currentUser.email).get().then(function (doc) {
    let userProfile = doc.data();

    let userEmail = document.getElementById('user-email')
    userEmail.innerText = userProfile.email;

    let userName = document.getElementById('user-name')
    userName.innerText = userProfile.displayName;

    let userGender = document.getElementById('user-gender')
    userGender.classList = userProfile.gender == 'female' ? 'fas fa-venus' : 'fas fa-mars';

    let userSkills = document.getElementById('user-skills')
    userSkills.innerText = userProfile.skills ? userProfile.skills : 'None';

    let userAvatar = document.getElementById('user-avatar-img')
    userAvatar.style.background = `url('${userProfile.avatarUrl}') center center no-repeat`
    userAvatar.style.backgroundSize = 'cover'

    let userCvUrl = document.getElementById('user-cv-url')
    userCvUrl.href = userProfile.cvUrl
    if (userProfile.cvUrl !== null) {
      userCvUrl.removeAttribute("disabled")
      userCvUrl.innerText = "Download"
    }

  }).catch(
    function (error) {
      console.log('cannot get profile document', error)
    }
  )
}

// fill the modal form when opened
controller.fillProfileForm = async function (profileForm) {
  let currentUser = firebase.auth().currentUser

  db.collection('users').doc(currentUser.email).get().then(function (doc) {
    if (doc.exists) {
      let userProfile = doc.data();
      profileForm.firstName.value = userProfile.displayName
      profileForm.genderRadio.value = userProfile.gender == 'female' ? 'female' : 'male'
      profileForm.userSkills.value = userProfile.skills ? userProfile.skills : ''
    } else {
      console.log("No such document!");
      profileFormfirstName.value = ''
      profileForm.genderRadio.value = ''
      profileForm.userSkills.value = ''
    }
  }).catch(
    function (error) {
      console.log('cannot get profile document', error)
    }
  )
}

// update the profile after filling the modal with new info
controller.updateProfile = async function (profileForm) {
  let currentUser = firebase.auth().currentUser

  let displayName = profileForm.firstName.value;
  let gender = profileForm.genderRadio.value;
  let skills = profileForm.userSkills.value;

  // thong tin khong co trong form, tu luu lai
  let email = currentUser.email;
  db.collection("users").doc(currentUser.email).set({
    displayName: displayName,
    gender: gender,
    skills: skills,
    // tu tay luu, neu khong se mat thong tin
    email: email,
  }, { merge: true })
    .then(function (docRef) {
      console.log("Document written")
      controller.fillProfilePage()
      alert("Profile updated.")
    })
    .catch(function (error) {
      console.error("Error adding document: ", error)
    });
}

// get the file links
let getFileUrl = function (fileRef) {
  return `https://firebasestorage.googleapis.com/v0/b/${fileRef.bucket}/o/${encodeURIComponent(fileRef.fullPath)}`
}

let getAvatarUrl = function (fileRef) {
  return `https://firebasestorage.googleapis.com/v0/b/${fileRef.bucket}/o/${encodeURIComponent(fileRef.fullPath)}?alt=media`
}

// upload to firebase and update link CV to profile page
controller.uploadCv = async function (file) {

  let fileName = file.name
  let filePath = `user-cv/${fileName}`
  let fileRef = firebase.storage().ref().child(filePath)
  await fileRef.put(file)
  let fileLink = getFileUrl(fileRef)
  updateCv(fileLink)
  console.log('File link: ' + fileLink)
  return fileLink
}

let updateCv = async function (link) {
  var fileRef = storage.refFromURL(link);

  // Get the download URL
  fileRef.getDownloadURL().then(function (url) {
    console.log('URL:' + url)
    let cvUrl = document.getElementById("user-cv-url")
    cvUrl.href = url
    cvUrl.removeAttribute("disabled")
    cvUrl.innerText = "Download"

    let currentUser = firebase.auth().currentUser
    db.collection("users").doc(currentUser.email).set({
      cvUrl: url
    }, { merge: true })
      .then(function (docRef) {
        console.log("Document written")
        alert("CV updated.")
      })
      .catch(function (error) {
        console.error("Error adding document: ", error)
      });

  }).catch(function (error) {
    console.log(error)
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/object-not-found':
        // File doesn't exist
        break;

      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;
      case 'storage/canceled':
        // User canceled the upload
        break;
      case 'storage/unknown':
        // Unknown error occurred, inspect the server response
        break;
    }
  });
}

controller.uploadAvatar = async function (file) {
  let fileName = file.name
  let filePath = `user-avatar/${fileName}`
  let fileRef = firebase.storage().ref().child(filePath)
  await fileRef.put(file)
  let fileLink = getAvatarUrl(fileRef)
  updateAvatar(fileLink)
  console.log('Avatar Link: ' + fileLink)
  return fileLink
}

let updateAvatar = async function (link) {
  let currentUser = firebase.auth().currentUser
  let userAvatar = document.getElementById('user-avatar-img')
  userAvatar.style.background = `url('${link}') center center no-repeat`
  userAvatar.style.backgroundSize = 'cover'

  db.collection("users").doc(currentUser.email).set({
    avatarUrl: link
  }, { merge: true })
    .then(function () {
      console.log("Document written")
      alert("Avatar updated.")
    })
    .catch(function (error) {
      console.error("Error adding document: ", error)
    });
}

// delete job
async function deleteJob(id, email) {
  // let company = await firebase.firestore().collection('company').doc(id).delete()
  let currentUser = firebase.auth().currentUser;
  await firebase.firestore().collection('job').doc(id).update({userSaved: firebase.firestore.FieldValue.arrayRemove(email)})
  console.log("Delete saved job ok")
  model.jobs = model.jobs.filter(function (v, i, arr) { return v.id != id; })
  controller.displaySavedJobs();
}

// handle saved jobs
controller.displaySavedJobs = async function () {

  let currentUser = firebase.auth().currentUser;
  let numberOfjob = []
  let logoCompany = []
  // doc.data() is never undefined for query doc snapshots
  let jobs = model.jobs
  let companys = model.companys
  document.querySelector(".jobGroup").innerHTML = ""
  for (let job of jobs) {
    for (let email of job.userSaved) {
      for (let company of companys) {
      if (email == currentUser.email) {
      if(company.name === job.nameCompany) {
        // display to profile
        numberOfjob.push(job)
        logoCompany.push(company)
        let jobTitle = job.title;
        let jobMoney = job.money;
        let jobDesc = job.description;
        let jobAdress = job.address;
        let jobSkill = job.skill;
        let jobLogo = company.logo
            let jobSaved = `
            <div class="jobContents">
            <div class="logo">
                <a><img src='${jobLogo}'/></a>
            </div>
            <div class="jobDesciption">
                <div class="jobBody">
                    <div class="titleJob">
                        <h3>${jobTitle}</h3>
                    </div>
                    <div class="jobSalary">
                        <span class="salaryIcon"><i class="fa fa-usd" aria-hidden="true"></i></span>
                        <span class="salaryNumber">
                        ${jobMoney}
                        </span>
                    </div>
                    <div class="descriptionText">
                        <p>
                        ${jobDesc.substr(0, 200)}...
                        </p>
                    </div>
                    <div class="jobBottom">
                        <div class="jobTagList">
                            <a>${jobSkill}</a>
                        </div>
                    </div>


                </div>
            </div>
            <div class="jobMoreInformation">

                <span class="jobTimeExpires">Expires on <span>3</span> days</span>
                <div class="jobLocation">
                    <span>${jobAdress}</span>
                </div>


            </div>
            <button onclick="deleteJob('${job.id}','${email}')" style="padding: 0 10px 0 10px; border-radius: 5px" class="fs18 save" id="job-delete">Delete Job</button>

        </div>
            `
        let userSavedJobs = document.querySelector(".jobGroup")
        view.appendHtml(userSavedJobs, jobSaved)
      }
    }
  }
}
}
  document.querySelector('#number-of-job').innerText = `you have ${numberOfjob.length} saved job`
  let searchSavedJob = document.querySelector('#search-saved-job')
  searchSavedJob.addEventListener('keyup',(e)=> {
    if (searchSavedJob.value.trim() !== "") {
      // let pagniate = document.querySelector('.paginate').style.display = 'none'
      const searchString = e.target.value.toLowerCase();
      const filteredCharacters = numberOfjob.filter((character) => {
        let userSavedJobs = document.querySelector(".jobGroup")
        userSavedJobs.innerHTML = ''
          return (
              character.title.toLowerCase().includes(searchString)
          );
      });
      for (let index = 0; index < numberOfjob.length; index++) {
        controller.showJobOfUser(filteredCharacters[index])
      }
    } else {
      controller.displaySavedJobs()
    }
  })
}
controller.displayAppliedJobs = async function () {

  let currentUser = firebase.auth().currentUser;
  let numberOfjob = []
  let logoCompany = []
  // doc.data() is never undefined for query doc snapshots
  let jobs = model.jobs
  let companys = model.companys
  document.querySelector(".jobGroup").innerHTML = ""
  for (let job of jobs) {
    for (let email of job.userApplied) {
      for (let company of companys) {
      if (email == currentUser.email) {
      if (company.name === job.nameCompany) {
        // display to profile
        numberOfjob.push(job)
        logoCompany.push(company)
        let jobTitle = job.title;
        let jobMoney = job.money;
        let jobDesc = job.description;
        let jobAdress = job.address;
        let jobSkill = job.skill;
        let jobLogo = company.logo
            let jobSaved = `
            <div class="jobContents">
            <div class="logo">
                <a><img src='${jobLogo}'/></a>
            </div>
            <div class="jobDesciption">
                <div class="jobBody">
                    <div class="titleJob">
                        <h3>${jobTitle}</h3>
                    </div>
                    <div class="jobSalary">
                        <span class="salaryIcon"><i class="fa fa-usd" aria-hidden="true"></i></span>
                        <span class="salaryNumber">
                        ${jobMoney}
                        </span>
                    </div>
                    <div class="descriptionText">
                        <p>
                        ${jobDesc.substr(0, 200)}...
                        </p>
                    </div>
                    <div class="jobBottom">
                        <div class="jobTagList">
                            <a>${jobSkill}</a>
                        </div>
                    </div>


                </div>
            </div>
            <div class="jobMoreInformation">

                <span class="jobTimeExpires">Expires on <span>3</span> days</span>
                <div class="jobLocation">
                    <span>${jobAdress}</span>
                </div>


            </div>
            <button onclick="deleteJob('${job.id}','${email}')" style="padding: 0 10px 0 10px; border-radius: 5px" class="fs18 save" id="job-delete">Delete Job</button>

        </div>
            `
        let userSavedJobs = document.querySelector(".jobGroup")
        view.appendHtml(userSavedJobs, jobSaved)
      }
    }
  }
}
}
  document.querySelector('#number-of-job').innerText = `you have ${numberOfjob.length} applied job`
  let searchSavedJob = document.querySelector('#search-saved-job')
  searchSavedJob.addEventListener('keyup',(e)=> {
    if (searchSavedJob.value.trim() !== "") {
      // let pagniate = document.querySelector('.paginate').style.display = 'none'
      const searchString = e.target.value.toLowerCase();
      const filteredCharacters = numberOfjob.filter((character) => {
        let userSavedJobs = document.querySelector(".jobGroup")
        userSavedJobs.innerHTML = ''
          return (
              character.title.toLowerCase().includes(searchString)
          );
      });
      for (let index = 0; index < numberOfjob.length; index++) {
        controller.showJobOfUser(filteredCharacters[index])
      }
    } else {
      controller.displayAppliedJobs()
    }
  })
}

controller.showJobOfUser = (data) =>{
  
  let email = firebase.auth().currentUser;
  let jobTitle = data.title;
  let jobMoney = data.money;
  let jobDesc = data.description;
  let jobAdress = data.address;
  let jobSkill = data.skill;
  let jobLogo = logo.logo
  const jobGroup = document.querySelector('.jobGroup');
  let jobSaved = `
  <div class="jobContents">
  <div class="logo">
      <a><img src='${jobLogo}'/></a>
  </div>
  <div class="jobDesciption">
      <div class="jobBody">
          <div class="titleJob">
              <h3>${jobTitle}</h3>
          </div>
          <div class="jobSalary">
              <span class="salaryIcon"><i class="fa fa-usd" aria-hidden="true"></i></span>
              <span class="salaryNumber">
              ${jobMoney}
              </span>
          </div>
          <div class="descriptionText">
              <p>
              ${jobDesc.substr(0, 200)}...
              </p>
          </div>
          <div class="jobBottom">
              <div class="jobTagList">
                  <a>${jobSkill}</a>
              </div>
          </div>


      </div>
  </div>
  <div class="jobMoreInformation">

      <span class="jobTimeExpires">Expires on <span>3</span> days</span>
      <div class="jobLocation">
          <span>${jobAdress}</span>
      </div>


  </div>
  <button onclick="deleteJob('${data.id}','${email}')" style="padding: 0 10px 0 10px; border-radius: 5px" class="fs18 save" id="job-delete">Delete Job</button>

</div>
  `
  view.appendHtml(jobGroup, jobSaved)
}

controller.resetPass = async function (email) {
  view.setText('log-in-error', '')
  view.setText('log-in-success', '')
  try {
    await firebase.auth().sendPasswordResetEmail(email)
    view.setText('log-in-success', 'An email password reset has been sended to your email address!')
  } catch (error) {
    view.setText('log-in-error', error.message)
  }

}
controller.postcompany = async function (company) {

  let name = company.name.toLowerCase()
  let allCompany = await firebase.firestore().collection('company').get()
  let docs = allCompany.docs
  for (let doc of docs) {
    let data = transformDoc(doc)
    //console.log(data)
    let dataName = data.name.toLowerCase()
    if (dataName == name) {
      alert('company existed!')
      return
    }
  }

  view.disable('btn-postcompany')

  await firebase.firestore().collection('company').add(company)

  alert('post company success!')
  document.getElementById('form-postcompanny').name.value = ''
  document.getElementById('form-postcompanny').address.value = ''
  document.getElementById('form-postcompanny').employee.value = ''
  document.getElementById('form-postcompanny').title.value = ''
  document.getElementById('form-postcompanny').description.value = ''
  view.enable('btn-postcompany')

}
controller.postjob = async function (job) {
  console.log('controller');
  let title = job.title.toLowerCase()
  let alljob = await firebase.firestore().collection('job').get()
    //.where('name', '==', name)
  let docs = alljob.docs
  for (let doc of docs) {
    let data = transformDoc(doc)
    //console.log(data)
    let datatitle = data.title.toLowerCase()
    if (datatitle == title) {
      alert('job existed!')
      return
    }
  }
  // view.disable('btn btn-default')

  await firebase.firestore().collection('job').add(job)

  alert('post job success!')
  document.getElementById('form-postjob').nameCompany.value = ''
  document.getElementById('form-postjob').title.value = ''
  document.getElementById('form-postjob').money.value = ''
  document.getElementById('form-postjob').address.value = ''
  document.getElementById('form-postjob').skill.value = ''
  document.getElementById('form-postjob').description.value = ''
  document.getElementById('form-postjob').SandE.value = ''
  document.getElementById('form-postjob').why.value = ''
  // view.enable('btn btn-default')
}
controller.listenJobChange = async () => {
  let db = await controller.initFirebaseStore().collection('job').onSnapshot(function(snapshot) {
    snapshot.docChanges().forEach(async function(change) {
      if (change.type === "added") {
        console.log("added");
        // if (change.doc.data().users.find((item) => item == firebase.auth().currentUser.email)) {
        //   view.addNotification(change.doc.data(), change.doc.id, friendImg.logo, friendImg.emailCompany)
        // }
        // view.showjobEmployer()
        view.addNewJob(change.doc.id, change.doc.data())
      }
    })
    return db
  })
}

controller.loadCompany = async function () {
  if (controller.loadedCompany) {
    return
  }
  let result = await firebase
    .firestore()
    .collection('company')
    .where("status", "==", "active")
    .get()
  let companys = transformDocs(result.docs)
  model.saveCompany(companys)

  controller.loadedCompany = true
}
controller.loadJob = async function () {
  if (controller.loadedJob) {
    return
  }
  let result = await firebase
    .firestore()
    .collection('job')
    .get()

  let jobs = transformDocs(result.docs)
  model.saveJob(jobs)

  controller.loadedJob = true
}

controller.saveJob = async function (id, email) {
  await firebase
    .firestore()
    .collection('job')
    .doc(id)
    .update({
      userSaved: firebase.firestore.FieldValue.arrayUnion(email)
    })
}
controller.appliedJob = async function (id, email) {
  await firebase
  .firestore()
  .collection('job')
  .doc(id)
  .update({
    userApplied: firebase.firestore.FieldValue.arrayUnion(email)
  })
}
controller.collectionJobChange = function () {
  let isFirstRun = true
  firebase
    .firestore()
    .collection('job')
    //.where('users', 'array-contains', currentEmail)
    .onSnapshot(async function () {
      if (isFirstRun) {
        isFirstRun = false
        return
      }
      await controller.loadJob()
      if (view.currentScreen == 'companyDetail') {
        view.clearHtml('listJob')
        view.showJob()
      }
      else {
        view.clearHtml('all-job')
        view.showJobLong(model.currentJobs)
      }
    })
}
controller.updateCompanyDetail = async function (id) {
  let db = firebase.firestore();
  db.collection("company").doc(id).update({
    name: formEdit.companyName.value,
    address: formEdit.companyAddress.value,
    employee: formEdit.companyEmployee.value,
    title: formEdit.companyTitle.value,
    description: formEdit.companyDesc.value
  }).then(function () {
    console.log("Company detail successfully updated!");
  }).catch(function (error) {
    // The document probably doesn't exist.
    console.error("Company detail update error: ", error);
  });
}
controller.inputSearch = async function (search) {
  let a = search.text.toLowerCase()
  let b = search.address.toLowerCase()
  await view.showComponents('alljob')
  view.clearHtml('all-job')
  let selecjob = []
  let jobs = model.jobs
  for (let job of jobs) {
    let address = job.address.toLowerCase().includes(b)
    let name = job.nameCompany.toLowerCase().includes(a)
    let skill=job.skill.toLowerCase().includes(a)
    if (name && address|| skill&&address) {
      selecjob.push(job)
    }
  }
  if (selecjob.length == 0) {
    alert('No job found!')
  }
  console.log(selecjob);

  view.showJobLong(selecjob)
  model.saveCurrentJobs(selecjob)
}
controller.checkbox = function () {
  let jobs = model.jobs
  let result = []
  let resultID = []
  let address = []
  let money = []
  let checkboxes = document.getElementsByName('checkbox')
  let checkboxes1 = document.getElementsByName('checkbox1')
  for (let checkbox of checkboxes) {
    if (checkbox.checked) {
      address.push(checkbox.value)
    }
  }
  for (let checkbox1 of checkboxes1) {
    if (checkbox1.checked) {
      money.push(checkbox1.value)
    }
  }
  if (address.length == 0 && money.length == 0) {
    return
  }
  console.log(address, money);
  for (let i = 0; i < address.length; i++) {
    for (let job of jobs) {
      if (address[i] == job.address
        || address[i] == job.address
        || address[i] == job.address) {
        resultID.push(job.id);
      }
    }
  }
  for (let j = 0; j < money.length; j++) {
    for (let job of jobs) {
      if (money[j] == 'duoi1000' && job.money < 1000
        || money[j] == 'tu1000den2000' && job.money >= 1000 && job.money <= 2000
        || money[j] == 'tren2000' && job.money > 2000) {
        resultID.push(job.id);
      }
    }
  }
  if (address.length == 0 || money.length == 0) {
    for (let i = 0; i < resultID.length; i++) {
      for (let job of jobs) {
        if (resultID[i] == job.id) {
          result.push(job)
        }
      }
    }
    console.log(result);
    view.clearHtml('all-job')
    view.showJobLong(result)
    model.saveCurrentJobs(result)
    return
  }
  for (let job of jobs) {
    let aid = job.id
    let start = resultID.indexOf(aid)
    if (start == -1) {
      continue;
    }
    resultID.splice(start, 1)
  }
  for (let i = 0; i < resultID.length; i++) {
    for (let job of jobs) {
      if (resultID[i] == job.id) {
        result.push(job)
      }
    }
  }
  console.log(result);
  if (result.length == 0) {
    alert('no job found!')
  }
  view.clearHtml('all-job')
  view.showJobLong(result)
  model.saveCurrentJobs(result)
}
function transformDoc(doc) {
  const data = doc.data()
  data.id = doc.id
  return data
}
function transformDocs(docs) {
  return docs.map(item => transformDoc(item))
}


function add() {
  var name = document.getElementById("name").value;
  var age = document.getElementById("age").value;
  var country = document.getElementById("country").value;
  
  if (name == "" || age == "" || country == "") {
    alert("Please fill all fields.")
  } else {
    document.getElementById("popup").style.display = "none";
    var newdiv = document.createElement("div");
    newdiv.className += "cont";
    newdiv.innerHTML = "Name: "+ name + "<br>Age: " + age + "<br>Country: " + country;
    document.getElementById("results").appendChild(newdiv);
    
    document.getElementById("name").value = "";
    document.getElementById("age").value = "";
    document.getElementById("country").value = "";
  }
}

controller.uploadLogo = async function (file) {
  let fileName = file.name
  let filePath = `logo/${fileName}`
  let fileRef = firebase.storage().ref().child(filePath)
  await fileRef.put(file)
  let fileLink = getAvatarUrl(fileRef)
  updateLogo(fileLink)
  console.log('Avatar Link: ' + fileLink)
  return fileLink
}

let updateLogo = async function (link) {
  let currentUser = firebase.auth().currentUser
  let user = await firebase.firestore().collection('company').where("emailCompany", "==", currentUser.email).get()
  let u = transformDocs(user.docs)
  let userLogo = document.getElementById('logo-test')
  userLogo.src = `${link}`

  db.collection("company").doc(u[0].id).set({
    logo: link
  }, { merge: true })
    .then(function () {
      console.log("Document written")
      alert("logo updated.")
    })
    .catch(function (error) {
      console.error("Error adding document: ", error)
    });
}

controller.uploadBg = async function (file) {
  let fileName = file.name
  let filePath = `logo/${fileName}`
  let fileRef = firebase.storage().ref().child(filePath)
  await fileRef.put(file)
  let fileLink = getAvatarUrl(fileRef)
  updateBg(fileLink)
  console.log('bg Link: ' + fileLink)
  return fileLink
}

let updateBg = async function (link) {
  let currentUser = firebase.auth().currentUser
  let user = await firebase.firestore().collection('company').where("emailCompany", "==", currentUser.email).get()
  let u = transformDocs(user.docs)
  let userBg = document.getElementById('bg-test')
  userBg.src = `${link}`

  db.collection("company").doc(u[0].id).set({
    bg: link
  }, { merge: true })
    .then(function () {
      console.log("Document written")
      alert("bg updated.")
    })
    .catch(function (error) {
      console.error("Error adding document: ", error)
    });
}
// controller.getTest = async function ()  {
//   let test = await firebase.firestore().collection("job").orderBy("money").limit(2).get()
//   let test2 = transformDocs(test.docs)

//   let next = await firebase.firestore().collection("job").orderBy("money").startAt(test2[1].money).limit(2).get();
//   return transformDocs(next.docs)
// }

controller.getNameCompanyCurrent = async () => {
  let currentUser = await firebase.auth().currentUser
  let company = await firebase.firestore().collection('company').where("emailCompany", "==", currentUser.email).get()
  let companyData = transformDocs(company.docs)
  let jobOfCompany = await firebase.firestore().collection('job').where("nameCompany", "==", companyData[0].name).get()
  // model.saveJobsCompany(transformDocs(jobOfCompany.docs))
  return (transformDocs(jobOfCompany.docs))
}

controller.getCv = async (userApplied) => {
  let getUser = await firebase.firestore().collection('users').where("email", "==", userApplied).get()
  return transformDocs(getUser.docs)
}
controller.sendMessages = async (email) => {
  let db = firebase.firestore()
  let data = await db.collection('users').where("email", "==", email).get()
  if (data.docs[0] !== undefined)
      return data.docs[0].data()
  else return null
}
controller.findConversation = async(collection, find, email) => {
  let db = firebase.firestore()
  let data = await db.collection(`${collection}`)
      .where(`${find}`, "in", [
          [`${email}`, `${firebase.auth().currentUser.email}`],
          [`${firebase.auth().currentUser.email}`, `${email}`]
      ])
      .get()
  if (data.docs[0] == undefined) return undefined
  return data.docs[0]
}
controller.getDate = () => {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return date + " " + time;
};
controller.addFireStore = (collection, data) => {
  var db = firebase.firestore();
  db.collection(collection).add(data)
      .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
          model.key = docRef.id
          return docRef.id
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
}
controller.firestoreArryUnion = (collection, document, data) => {
  let db = firebase.firestore()
  db.collection(collection).doc(document).update({
      check: false,
      messages: firebase.firestore.FieldValue.arrayUnion({
          content: data,
          createdAt: controller.getDate(),
          owner: firebase.auth().currentUser.email
      })
  })
}
controller.initFirebaseStore = () => {
  return firebase.firestore()
}

controller.updateCheckConversation = (collection, document, data) => {
  let db = firebase.firestore()
  db.collection(collection).doc(document).update({
      check: data
  })
}
controller.getInfoUser = async(email) => {
  let db = firebase.firestore()
  let data = await db.collection('company').where("emailCompany", "==", email).get()
  if (data.docs[0] !== undefined)
      return data.docs[0].data()
  else return null
}
controller.getDataFireStore = async(collection, find, check = null) => {
  let db = firebase.firestore()
  if (check == null) {
      let data = await db.collection(`${collection}`)
          .where(`${find}`, "==", firebase.auth().currentUser.email)
          .get()
      return data.docs[0].data()
  } else {
      let data = await db.collection(`${collection}`)
          .where(`${find}`, `${check}`, firebase.auth().currentUser.email)
          .get()
      return data.docs
  }
}
// controller.listenNotification = () => {
//   let db = controller.initFirebaseStore().collection('conversations').onSnapshot(function(snapshot) {
//     snapshot.docChanges().forEach(async function(change) {
//       if (change.type === "added") {
//         const friendImg = await controller.getInfoUser(change.doc.data().users.find((user) => user !== firebase.auth().currentUser.email))
//         console.log(friendImg);
//         console.log("added");
//         console.log(change.doc.data().users);
//         if (change.doc.data().users.find((item) => item == firebase.auth().currentUser.email)) {
//           view.addNotification(change.doc.data(), change.doc.id, friendImg.avatarUrl, friendImg.email)
//         }
//         controller.updateModelConversation()
//       }
//     })
//   })
//   return db
// }
controller.listenConversation = async () => {
  let db = await controller.initFirebaseStore().collection('conversations').onSnapshot(function(snapshot) {
    snapshot.docChanges().forEach(async function(change) {
      if (change.type === "added") {
        let friendImg = await controller.getInfoUser(change.doc.data().users.find((user) => user !== firebase.auth().currentUser.email))
        console.log(friendImg);
        console.log("added");
        if (change.doc.data().users.find((item) => item == firebase.auth().currentUser.email)) {
          view.addNotification(change.doc.data(), change.doc.id, friendImg.logo, friendImg.emailCompany)
        }
        controller.updateModelConversation()
      }
      if (change.type === "modified") {
        console.log("Modified city: ", change.doc.data());
        let box = document.querySelector('.showMessagesDirect')
        let friendImg = await controller.getInfoUser(change.doc.data().users.find((user) => user !== firebase.auth().currentUser.email))
        console.log(friendImg)
        let modelConversation = model.allConversation.find((item)=>item.id == change.doc.id)
        let messageData = change.doc.data().messages
        console.log(change.doc.id)
        if (model.currentConversation !== null) {
            if (change.doc.id == model.currentConversation.id && messageData.length !== modelConversation.messages.length) {
                let messages = change.doc.data().messages
                let html = ''
                let messageBox = document.querySelector('.showMessages')
                if (messages[messages.length - 1].owner == firebase.auth().currentUser.email)
                    html += view.addYourMessage(messages[messages.length - 1].content,messages[messages.length - 1].createdAt)
                else html += view.addFriendMessage(messages[messages.length - 1].content, friendImg.photoURL)
                
                console.log(messageBox)
                messageBox.innerHTML += html
                box.scrollTop = box.scrollHeight                
            }
        }
        model.allConversation.find((item,index) => {
            if(item.id == change.doc.id){
                model.allConversation[index].messages = change.doc.data().messages
                return item
            }
        });
        if(modelConversation !== undefined){
          let font = document.getElementById(`${change.doc.id}`)
          font.remove()
          view.addNotification(change.doc.data(), change.doc.id, friendImg.logo, friendImg.emailCompany)
        }
      }
    })
  })
  return db
}

controller.convertToTimeStamp = (data) => {
  if (data !== undefined) {
    let timeStamp = new Date(data).getTime() / 1000;
    return timeStamp;
  } else return "";
};
controller.sortByTimeStamp = (data) => {
  let arrAfterSort = data.sort((a, b) => {
    return b.createdAt - a.createdAt;
  });
  return arrAfterSort;
};
controller.updateModelConversation = async(imgLink) => {
  let allconversation = await controller.getDataFireStore('conversations', 'users', 'array-contains')
  model.allConversation = []
  let conversations = []
  if (allconversation.length !== 0) {
      for (let x of allconversation) {
          let friendImg = await controller.sendMessages(x.data().users.find((user) => user !== firebase.auth().currentUser.email))
          conversations.push({
              createdAt: controller.convertToTimeStamp(x.data().messages[x.data().messages.length - 1]['createdAt']),
              messages: x.data().messages,
              id: x.id,
              users: x.data().users,
              friendImg: await controller.sendMessages(x.data().users.find((user) => user !== firebase.auth().currentUser.email)).avatarUrl,
              friendEmail: x.data().users.find((item) => item !== firebase.auth().currentUser.email)
          })
      }
      model.allConversation = controller.sortByTimeStamp(conversations)
  }
}