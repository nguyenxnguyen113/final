const view = {
  currentScreen: null,
  lastScreen: null,
  pastScreen: null,
}

view.showComponents = async function (name) {
  view.currentScreen = name
  view.saveLastLocation(name)

  await controller.loadCompany()
  await controller.loadJob()


  switch (name) {
    case 'home': {
      view.pastScreen = 'home'
     
      let currentUser = firebase.auth().currentUser
      console.log(currentUser)
      model.saveCurrentJobs(model.jobs)
      let app = document.getElementById('app')
      app.innerHTML = component.navTransf + component.header + component.home
      let registCompany = document.getElementById('link-employer')

      registCompany.onclick = rC
      function rC() {
        view.showComponents('registCompany')
      }
      let form = document.getElementById('form-search')
      form.onsubmit = formSubmitSearch

      view.inputSearch()

      function formSubmitSearch(event) {
        event.preventDefault()
        let search = {
          text: form.search.value,
          address: form.address.value
        }
        controller.inputSearch(search)
      }
      view.nextLink()
      

      jobSkill()
      view.showCompany()
      view.ShowNav()
      
      if (currentUser.emailVerified) {
        registCompany.classList.add("disable-employer");
      }
      break;
    }
    case 'login': {
      
      let app = document.getElementById('app')
      app.innerHTML = component.navNoTransf + component.login

      let link = document.getElementById('register-link')
      link.onclick = registerLinkCLickHandler

      let resetPass = document.getElementById('forgot')
      resetPass.onclick = resetPassHandler
      let registCompany = document.getElementById('link-employer')
      registCompany.onclick = rC
      let form = document.getElementById('form-login')
      form.onsubmit = formSubmit

      view.nextLink()
      function rC() {
        view.showComponents('registCompany')
      }
      function resetPassHandler() {
        let email = form.email.value
        controller.resetPass(email)
      }
      function registerLinkCLickHandler() {
        view.showComponents('register')
      }
      function formSubmit(event) {
        event.preventDefault()
        let logInInfo = {
          email: form.email.value,
          password: form.password.value,
          role: 'user'
        }
        let validateResult = [
          view.validate(
            logInInfo.email && logInInfo.email.includes('@'),
            'email-error',
            'Invalid email!'
          ),
          view.validate(
            logInInfo.password && logInInfo.password.length >= 6,
            'password-error',
            'Invalid password!'
          )
        ]
        if (allPassed(validateResult)) {
          controller.logIn(logInInfo)
        }
      }
      break;
    }
    case 'register': {

      let app = document.getElementById('app')
      app.innerHTML = component.navNoTransf + component.register

      let link = document.getElementById('login-link')
      link.onclick = registerLinkCLickHandler

      let form = document.getElementById('form-register')
      form.onsubmit = formSubmit

      view.nextLink()

      function registerLinkCLickHandler() {
        view.showComponents('login')
      }

      function formSubmit(event) {
        event.preventDefault()

        let registerInfo = {
          fullname: form.fullname.value,
          email: form.email.value,
          password: form.password.value,
          confirmPassword: form.confirmPassword.value,
        }

        let validateResult = [
          view.validate(registerInfo.fullname, 'fullname-error', 'Invalid fullname!'),
          view.validate(
            registerInfo.email && registerInfo.email.includes('@'),
            'email-error',
            'Invalid email!'
          ),
          view.validate(
            registerInfo.password && registerInfo.password.length >= 6,
            'password-error',
            'Invalid password!'
          ),
          view.validate(
            registerInfo.confirmPassword
            && registerInfo.confirmPassword.length >= 6
            && registerInfo.password == registerInfo.confirmPassword,
            'confirm-password-error',
            'Invalid confirm password!'
          )
        ]
        if (allPassed(validateResult)) {
          controller.register(registerInfo)
        }
      }

      break;
    }
    case 'companyDetail': {
      view.pastScreen = 'companyDetail'
      let currentUser = firebase.auth().currentUser
      let app = document.getElementById('app')
      app.innerHTML = component.navNoTransf + component.companydetail
      view.nextLink()
      
      
   
      controller.collectionJobChange()

      view.showCompanyDetail()
      view.showJob()
      view.showJobDetail()
      view.ShowNav()
      let registCompany = document.getElementById('link-employer')

      registCompany.addEventListener('click', () => {
        view.showComponents('registCompany')
      })
      if (currentUser.emailVerified) {
        registCompany.classList.add("disable-employer");
      }

      break;
    }
    case 'alljob': {
      view.pastScreen = 'alljob'
      let currentUser = firebase.auth().currentUser
      model.saveCurrentJobs(model.jobs)

      let app = document.getElementById('app')
      app.innerHTML = component.navTransf + component.header + component.alljob


      let form = document.getElementById('form-search')
      form.onsubmit = formSubmitSearch
      // await controller.loadJob()
      view.nextLink()
      view.ShowNav()
      view.inputSearch()
      jobSkill()
 
      function formSubmitSearch(event) {
        event.preventDefault()
        let search = {
          text: form.search.value,
          address: form.address.value,
        }
        controller.inputSearch(search)
      }
      // logic bộ lọc
     

      let adr = []
      let optionCheckbox = document.getElementById('option-checkbox')
      for (let job of model.jobs) {
        adr.push(job.address)
      }
      let selecADR = adr.filter((item, index) => adr.indexOf(item) === index);
      for (let i = 0; i < selecADR.length; i++) {
        htmlAddress = `<div class="form-check">
                            <label class="form-check-label">
                                <input type="checkbox" name="checkbox" class="form-check-input" value="${selecADR[i]}">${selecADR[i]}
                            </label>
                        </div>`
        view.appendHtml(optionCheckbox, htmlAddress)
      }
      //
      document.getElementById('all').onclick = selecAll
      function selecAll() {
        let checkboxes = document.getElementsByName('checkbox');
        for (let checkbox of checkboxes) {
          checkbox.checked = this.checked;
        }
      }
      document.getElementById('all1').onclick = selecAll1
      function selecAll1() {
        let checkboxes = document.getElementsByName('checkbox1');
        for (let checkbox of checkboxes) {
          checkbox.checked = this.checked;
        }
      }

      controller.collectionJobChange()
      view.showJobLong(model.currentJobs)
      let registCompany = document.getElementById('link-employer')

      registCompany.addEventListener('click', () => {
        view.showComponents('registCompany')
      })
      if (currentUser.emailVerified) {
        registCompany.classList.add("disable-employer");
      }

      break;
    }
    case 'profile': {
      let currentUser = firebase.auth().currentUser
      if (!currentUser) {
        view.showComponents('home')
        return
      } 
      let app = document.getElementById('app')
      app.innerHTML = component.navNoTransf + component.profile
      view.nextLink()
      view.ShowNav()
      let registCompany = document.getElementById('link-employer')

      let profileForm = document.getElementById('editProfileForm')
      controller.fillProfileForm(profileForm)

      let btnSubmitProfile = document.getElementById('submitProfileForm');
      btnSubmitProfile.onclick = handleSubmitProfile


      function handleSubmitProfile() {
        controller.updateProfile(profileForm)
      }

      controller.fillProfilePage()

      // handle avatar 
      let avatarUploadForm = document.getElementById('avatar-form-upload')
      avatarUploadForm.onsubmit = async function (e) {
        e.preventDefault()
        try {
          let files = avatarUploadForm.fileChooserAvatar.files
          let file = files[0]
          if (!file) {
            throw new Error('Choose a file!')
          }
          // upload to firebase + update 
          await controller.uploadAvatar(file)
        } catch (err) {
          alert(err.message)
        }
      }

      // handld CV
      let cvUploadForm = document.getElementById('cv-form-upload')
      cvUploadForm.onsubmit = async function (e) {
        e.preventDefault()
        try {
          let files = cvUploadForm.fileChooser.files
          let file = files[0]
          if (!file) {
            throw new Error('Choose a file!')
          }

          // upload to firebase + update
          await controller.uploadCv(file)
        } catch (err) {
          alert(err.message)
        }
      }
      if (currentUser.emailVerified) {
        registCompany.classList.add("disable-employer");
      }
      // show saved jobs
      controller.displaySavedJobs()
      break;
    }
    case 'loading': {
      let app = document.getElementById('app')
      app.innerHTML = component.loading
      break;
    }
    case 'registCompany': {
      let app = document.getElementById('app')
      app.innerHTML = component.navNoTransf + component.registCompany
      let form = document.getElementById('regist-company')
      form.onsubmit = formSubmit

      view.nextLink()

     

      function formSubmit(event) {
        event.preventDefault()

        let registerInfo = {
          nameCompany: form.nameCompany.value,
          addressCompany: form.addressCompany.value,
          titleCompany: form.titleCompany.value,
          fullname: form.nameEmployer.value,
          email: form.email.value,
          password: form.password.value,
          confirmPassword: form.confirmPassword.value,
        }

        let validateResult = [
          view.validate(registerInfo.fullname, 'nameE-error', 'Invalid fullname!'),
          view.validate(registerInfo.nameCompany ,'nameCompany-error','Invalid name company!'),
          view.validate(
            registerInfo.email && registerInfo.email.includes('@'),
            'email-error',
            'Invalid email!'
          ),
          view.validate(registerInfo.addressCompany ,'addressCompany-error','Invalid address company!'),
          view.validate(registerInfo.titleCompany ,'titleCompany-error','Invalid title company!'),
          view.validate(
            registerInfo.password && registerInfo.password.length >= 6,
            'password-error',
            'Invalid password!'
          ),
          view.validate(
            registerInfo.confirmPassword
            && registerInfo.confirmPassword.length >= 6
            && registerInfo.password == registerInfo.confirmPassword,
            'confirm-password-error',
            'Invalid confirm password!'
          )
        ]
        if (allPassed(validateResult)) {
          controller.registCompany(registerInfo)
          
        }
      }
      document.getElementById('sign-in-regist-company').addEventListener('click',() =>{
        view.showComponents('loginCompany')
      })
      view.nextLink()
      break;
    }
    case 'loginCompany': {
      let app = document.getElementById('app')
      app.innerHTML = component.loginCompany
      let form = document.getElementById('login-employer')
      form.onsubmit = formSubmit
      function formSubmit(event) {
        event.preventDefault()
        let logInInfo = {
          email: form.loginEmail.value,
          password: form.loginPassword.value,
        }
        let validateResult = [
          view.validate(
            logInInfo.email && logInInfo.email.includes('@'),
            'email-error',
            'Invalid email!'
          ),
          view.validate(
            logInInfo.password && logInInfo.password.length >= 6,
            'password-error',
            'Invalid password!'
          )
        ]
        if (allPassed(validateResult)) {
          controller.loginEmployer(logInInfo)
        }
      }
      break;
    }
    case 'employerScreen': {
      let app = document.getElementById('app')
      app.innerHTML = component.detailEmployer
      view.showCompanyDetailEmployer()
      document.getElementById('link-home').addEventListener('click', () => {
        view.showComponents(employerScreen)
      })
      break;
    }
  }
}
view.showCompany = function () {
  let listCompany = document.getElementById("listComponys")

  if (model.companys) {
    companys = model.companys
    
    for (let company of companys) {

      let name = company.name
      let nameId = name.replace(' ', '')
      let logo = company.logo
      let cardCompany = `<div class="col-md-4 ">
  <div class="card rounded  ">
    <img src="${logo}" class="card-img" alt="...">
    <div class="pd10">
      <p  style="text-align: center; font-size:18px" class="namecompany-hover">${company.name}</p>
    </div>
    <div class="p-2 d-flex justify-content-between">

      <p style="color:  #A50B0B; font-size: 13px;">10 công việc </p>
      <a   onclick=linkCompanyDetail('${nameId}')  style=" color:#013B80;font-size: 13px;"> xem thêm >> </a>
    </div>
  </div>
</div>`
      view.appendHtml(listCompany, cardCompany)
    }
  }

}
view.showCompanyDetail = function () {
  let abc = localStorage.getItem('companyId');
  if (!model.companyId) {
    model.saveId(abc)
  }

  let companydetail = document.getElementById("companyDetail")
  if (model.companys) {
    companys = model.companys
    for (let company of companys) {

      let nameId = company.name.replace(' ', '')


      if (model.companyId == nameId) {
        let name = company.name

        let companyDetail = ` 
      <div style="margin-right: 10px" class="logo-cty col-sm-3">
          <div>
              <img style="max-width: 100%" src="${company.logo}" alt="">
              <div>
                  <div style="text-align: center; padding-bottom: 20px"><span class="fw500 fs20">${name}</span></div>
                  <div style="padding-bottom: 10px"><i class="fas fa-map-marker-alt"></i><span>&nbsp;${company.address}</span>
                  </div>
                  <div style="padding-top: 20px"><i class="fas fa-users"></i><span>&nbsp;${company.employee}+</span></div>
              </div>
          </div>
      </div>
      <div class="about col-sm-8">
          <div class="img-jd">
              <img style="max-width: 100%; border: 5px solid #C4C4C4;" src="${company.bg}" alt="">
          </div>
    
          <div class="pt0">
              <div style="text-align: center">
                  <span class="fw500 fs20">${company.title}</span>
              </div>
              <div>
                  <p>&nbsp;&nbsp;&nbsp;&nbsp; ${company.description}</p>
              </div>
          </div>
      </div>`
        view.appendHtml(companydetail, companyDetail)
        break;
      }
    }
  }
}
view.showJob = function () {

  let listJob = document.getElementById("listJob")
  let test = {
    verified: false
  }
  let currentUser = firebase.auth().currentUser
  if(!currentUser) {
     test.emailVerified 
  } else {
    test.verified = currentUser.emailVerified
  }
 
  if (model.jobs) {

    let jobs = model.jobs
    for (let job of jobs) {

      let userEmail = job.userSaved
      let nameId = job.nameCompany.replace(' ', '')
      if (model.companyId && model.companyId == nameId) {

        let btnSave = ``

        if (test.verified) {
          btnSave = `<button id="btn-save" class="fs18 save" onclick=userSavedHandler('${job.id}')>Save</button>`

          for (let i = 0; i < userEmail.length; i++) {
            let a = userEmail[i]
            if (currentUser.email == a) {
              btnSave = `<button disabled id="btn-save" class="fs18 saved">Saved</button>`

            }
          }

        }

        let jobCompany = `
          <div class="jobcompany col-sm-5" style="padding-bottom: 10px">
          <div>
              <a onclick=linkCompanyDetail('${job.id}')>
                  <span class="fw500 fs25">${job.title}
                  </span>
              </a>
          </div>
          <div>
              <span style="color: #a50b0b" id="salary" ><i class="fas fa-search-dollar"></i>  ${test.verified ? "up to" + job.money + "$" : "Sign in to view"}</span>
          </div>
          <div>
              <span>${job.description.substr(0, 200)}...</span>
          </div>
          <div>
              <span style="color: #013B80;" class="fs20"><i class="fas fa-map-marker-alt"></i> ${job.address}
              </span>
          </div>
          <div class="footer-card">
              <div>
                  <span class="fs18 skill">${job.skill}</span>
              </div>
              ${btnSave}
          </div>
          </div>`


        view.appendHtml(listJob, jobCompany)
      }
    }
  }
}
view.showJobLong = function (seclecjob) {

  let showAlljob = document.getElementById('all-job')
  let test = {
    verified: false
  }
  let currentUser = firebase.auth().currentUser
  if(!currentUser) {
     test.emailVerified 
  } else {
    test.verified = currentUser.emailVerified
  }
  let companys = model.companys
  let jobs = seclecjob

  for (let job of jobs) {
    for (let company of companys) {
      if (company.name == job.nameCompany) {

        let userEmail = job.userSaved
        let btnSave = ``

        if (test.verified) {
          btnSave = `<button id="btn-save" class="fs18 save" onclick=userSavedHandler('${job.id}')>Save</button>`

          for (let i = 0; i < userEmail.length; i++) {
            let a = userEmail[i]
            if (currentUser.email == a) {
              btnSave = `<button disabled id="btn-save" class="fs18 saved">Saved</button>`
              break;
            }
          }
        }

        let alljob =
          `
            <div style="padding: 15px" class="row">
                <div class="col-sm-3">
                  <div style="width: 100px; height: 100px;">
                    <img style="max-width: 100%; max-height: 100%" src="${company.logo}" alt="">
                  </div>
                </div>
                <div class="col-sm-9">
                  <div>
                  <a onclick=linkCompanyDetail('${job.id}')>
                    <span class="fw500 fs25">${job.title}
                    </span>
                    </a>
                  </div>
                  <div>
                    <span style="color: #a50b0b" id="salary"><i class="fas fa-search-dollar"></i> ${test.verified ? job.money + "$" : "Sign in to view"}</span>
                  </div>
                  <div>
                    <span>${job.description.substr(0, 200)}...</span>
                  </div>
                  <div>
                    <span style="color: #013B80;" class="fs20"><i class="fas fa-map-marker-alt"></i>
                    ${job.address}</span>
                  </div>
                  <div class="footer-card">
                    <div>
                      <span class="fs18 skill">${job.skill}</span>
                    </div>
                    ${btnSave}
                  </div>
                </div>
            </div>
            `
            
        view.appendHtml(showAlljob, alljob)
      }
    }
  }
}
function userSavedHandler(id) {
  view.disable('btn-save')
  let email = firebase.auth().currentUser.email

  let jobs = model.currentJobs
  for (let job of jobs) {
    if (id == job.id) {
      let arr = job.userSaved
      arr.push(email)
    }
  }

  controller.saveJob(id, email)
}
view.showJobDetail = function () {
  let jobdetail = document.getElementById("clear")
  let test = {
    verified: false
  }
  let currentUser = firebase.auth().currentUser
  if(!currentUser) {
     test.emailVerified 
  } else {
    test.verified = currentUser.emailVerified
  }
  if (model.jobs) {
    jobs = model.jobs
    for (let job of jobs) {
      if (model.companyId) {
        companyId = model.companyId
        if (companyId === job.id) {
          view.clearHtml("clear")
          if (model.companys) {
            companys = model.companys
            for (let company of companys) {
              if (company.name === job.nameCompany) {

                let jobDetail = `
          <div class="about-company">
          <div class="pt30">
              <span class="fw500 fs25">JOB DETAIL</span>
          </div>
          <div class="detail row">
              <div style="margin-right: 10px" class="logo-cty col-sm-3">
                  <div>
                      <img style="max-width: 100%" src="${company.logo}" alt="">
                      <div>
                          <div style="text-align: center; padding-bottom: 20px"><span class="fw500 fs20"> ${job.nameCompany}</span></div>
                          <div style="padding-bottom: 10px"><i class="fas fa-map-marker-alt"></i><span>&nbsp;${job.address}</span>
                          </div>
                          <div style="padding-top: 20px"><i class="fas fa-users"></i><span>&nbsp;1000+</span></div>
                      </div>
                  </div>
              </div>
              <div class="about col-sm-8">
                 <div class="row">
                     <div class="col-md-8">
                      <p style="font-weight: 500;font-size: 23px;">${job.title}</p>
                     </div>
                     <div class="col-md-4">
                      <button class="btn-sj">Save Job</button>
                     </div>
                 </div>
                 <div class="pl20">
                      <div>
                          <span style="color: #a50b0b" id="salary" class="fs20"><i class="fas fa-search-dollar fs20"></i> ${test.verified ? job.money + "$" : "Sign in to view"}</span>
                      </div>
                      <div>
                          <span style="color: #013B80;" class="fs20"><i class="fas fa-map-marker-alt fs20"></i> ${job.address} </span>
                      </div>
                  </div>
                  <div class="pl20 mt20">
                      <span class="fs18 skill">${job.skill}</span>
                  </div>
                  <div class="pt20">
                      <div class="pl20">
                          <p style="font-weight: 500;font-size: 23px;">The job</p>
                          <p>
                          ${job.description}
                          </p>
                      </div>
                      <div class="pl20">
                          <p style="font-weight: 500;font-size: 23px;">Your Skills and Experience</p>
                          <p>
                          ${job.SandE}
                          </p>
                      </div>
                      <div class="pl20">
                          <p style="font-weight: 500;font-size: 23px;">Why You'll Love Working Here</p>
                          <p>
                          ${job.why}
                          </p>
                      </div>
                      <div class="pl20">
                      <p style="font-weight: 500;font-size: 23px;">Send at Your CV</p>
                      <p>
                      ${company.emailCompany}
                      </p>
                  </div>
                      <!-- Button trigger modal -->
                          <div class="btn-apply">
                              <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">APPLY NOW</button>
                          </div>
                          <!-- Modal -->
                          <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                              <div class="modal-dialog" role="document">
                              <div class="modal-content">
                                  <div class="modal-header">
                                  <h5 class="modal-title" id="exampleModalLabel">Apply now</h5>
                                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                      <span aria-hidden="true">&times;</span>
                                  </button>
                                  </div>
                                  <div class="title-up">
                                      <p>Upload your CV</p>
                                  </div>
                                  <div class="modal-body btn-modal-apply">
                                      <button>UPLOAD</button>
                                  </div>
                              </div>
                              </div>
                          </div>
                  </div>
               </div>

              </div>
          </div>`
                view.appendHtml(jobdetail, jobDetail)
                break;
              }
            }
          }
        }
      }
    }
  }
}
function linkCompanyDetail(id) {

  model.saveId(id)
  localStorage.setItem('companyId', model.companyId);
  view.showComponents("companyDetail")
}
async function linkJobDetail(skill) {
  await view.showComponents('alljob')
  view.clearHtml('all-job')
  let a = []
  let jobs = model.jobs
  for (let job of jobs) {
    if (job.skill == skill) {
      a.push(job)
    }
  }
  view.showJobLong(a)
  model.saveCurrentJobs(a)
}
function jobSkill() {
  let skillContainer = document.getElementById('job-skill')
  let result = []
  let jobs = model.jobs
  for (let job of jobs) {
    result.push(job.skill)
  }
  let skills = result.filter((item, index) => result.indexOf(item) === index);
  for (let i = 0; i < skills.length; i++) {
    let skill = skills[i];

    let htmlSkill = `<a id="skill-${i}" class="nav-link nav-item ">${skill}</a>`
    skillContainer.innerHTML += htmlSkill
  }

  for (let i = 0; i < skills.length; i++) {
    let skill = skills[i];
    let skillTag = document.getElementById(`skill-${i}`)
    skillTag.onclick = function (e) {
      console.log('click ', skill)
      e.preventDefault()
      linkJobDetail(skill)
    }
  }
}
view.saveLastLocation = function (screenName) {
  view.lastScreen = screenName
  window.location.hash = `#${screenName}`
}
view.showLastLocation = function (rollbackScreenName) {
  let lastLocation = view.getLastLocation()
  if (lastLocation) {
    view.showComponents(lastLocation)
  } else {
    view.showComponents(rollbackScreenName)
  }
}
view.getLastLocation = function () {
  let hash = window.location.hash
  let screenNames = ['register', 'login', 'home', 'companyDetail', 'alljob', 'profile','registCompany']
  if (hash && hash.length && hash.startsWith('#')) {
    let lastLocation = hash.substring(1)
    if (screenNames.includes(lastLocation)) {
      return lastLocation
    }
  }
  return null
}
view.inputSearch = function () {
  let adr = []
  let optionAddress = document.getElementById('option-address')
  for (let job of model.jobs) {
    adr.push(job.address)
  }
  let selecADR = adr.filter((item, index) => adr.indexOf(item) === index);
  for (let i = 0; i < selecADR.length; i++) {
    htmlAddress = `<option>${selecADR[i]}</option>`
    view.appendHtml(optionAddress, htmlAddress)
  }
}



// các hàm tiện ích
view.ShowNav = function () {
  let link = document.getElementById("dropdown")
  let test = {
    verified: false
  }
  let currentUser = firebase.auth().currentUser
  if(currentUser) {
     test.verified = currentUser.emailVerified
  } 
  if(test.verified === false) {
    return
  }
  view.clearHtml("dropdown")

  link.innerHTML = component.dropdown
  view.setText('text-login', "ACC")

  let profile = document.getElementById("btn-profile")
  profile.onclick = function () {
    view.showComponents("profile")
  }
  let registCompany = document.getElementById("link-employer")
  registCompany.onclick = function () {
    view.showComponents("registCompany")
  }
  let btnSignOut = document.querySelector('#btn-out')
  btnSignOut.onclick = function () {
    firebase.auth().signOut()
  }
}
view.nextLink = function () {

  if (view.currentScreen == 'home' || view.currentScreen == 'alljob') {
    let bgChange = document.getElementById(`${view.currentScreen}`)
    bgChange.style.color = "#2F76CA"
  }

  let link = document.getElementById("next-login")
  link.onclick = loginLinkClick
  function loginLinkClick() {
    view.showComponents("login")
  }
  let job = document.getElementById("link-job")
  job.onclick = function () {
    view.showComponents("alljob")
  }
  let home = document.getElementById("link-home")
  home.onclick = function () {
    view.showComponents("home")
  }

}
view.clearHtml = function (id) {
  document.getElementById(id).innerHTML = ""
}
view.appendHtml = function (element, html) {
  element.innerHTML += html
}
view.setText = function (id, text) {
  document.getElementById(id).innerText = text
}
view.validate = function (condition, idErrorTag, messageError) {
  if (condition) {
    view.setText(idErrorTag, '')
    return true
  } else {
    view.setText(idErrorTag, messageError)
    return false
  }
}
function allPassed(validateResult) {
  for (let result of validateResult) {
    if (!result) {
      return false
    }
  }
  return true
}
view.showCompanyDetailEmployer = async function () {
  let companydetail = document.getElementById("detail")
  let currentUser = firebase.auth().currentUser
  let user = await firebase.firestore().collection('company').where("emailCompany", "==", currentUser.email).get()
  let u = transformDocs(user.docs)
  console.log(u[0].name)
        let companyDetail = ` 
        <div style="margin-right: 10px" class="logo-cty col-sm-3">
            <div>
                <img style="max-width: 100%" src="${u[0].logo}" alt="">
                <div>
                    <div style="text-align: center; padding-bottom: 20px"><span class="fw500 fs20">${u[0].name}</span></div>
                    <div style="padding-bottom: 10px"><i class="fas fa-map-marker-alt"></i><span>&nbsp;${u[0].address}</span>
                    </div>
                    <div style="padding-top: 20px"><i class="fas fa-users"></i><span>&nbsp;${u[0].employee}+</span></div>
                </div>
            </div>
        </div>
        <div class="about col-sm-8">
        <div class="row">
        <div class="col-md-10">
            <div class="img-jd">
                <img style="max-width: 100%; border: 5px solid #C4C4C4;" src="${u[0].bg}" alt="">
            </div>
            <div class="pt0">

                <div style="text-align: center">
                    <span class="fw500 fs20">${u[0].title}</span>
                
                </div>

                <div>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp; ${u[0].description}</p>
                </div>
            </div>
            </div>
            <div class="col-md-2">
            <button class="btn-sj" data-toggle="modal" data-target="#exampleModal" id="btn-edit-company-detail">EDIT COMPANY</button>
           </div>

<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
  aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Edit Company Detail</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>


      <div class="modal-body">
        <div class="col-md-9">
          <div class="edit-profile">

            <form id="editCompanyDetail" method="post">

              <div class="form-group">
                <label class="col-xs-3 form-control-label" for="companyName">Company Name</label>
                <div class="col-xs-9">
                  <input type="text" class="form-control" id="companyName" name="companyName"
                    placeholder="${u[0].name}">
                </div>
              </div>

              <div class="form-group">
                <label class="col-xs-3 form-control-label" for="companyAddress">Address</label>
                <div class="col-xs-9">
                  <input type="text" class="form-control" name="companyAddress" placeholder="${u[0].address}">
                </div>
              </div>
                            
              <div class="form-group">
              <label class="col-xs-3 form-control-label" for="companyEmployee">Employee</label>
              <div class="col-xs-9">
              <input type="text" class="form-control" name="companyEmployee" placeholder="${u[0].employee}">
              </div>
              </div>

              <div class="form-group">
              <label class="col-xs-3 form-control-label" for="companyTitle">Title</label>
              <div class="col-xs-9">
              <input type="text" class="form-control" name="companyTitle" placeholder="${u[0].title}">
              </div>
              </div>

              <div class="form-group">
              <label class="col-xs-3 form-control-label" for="companyDesc">Description</label>
              <div class="col-xs-9">
              <input type="text" class="form-control" name="companyDesc" placeholder="${u[0].description}">
              </div>
              </div>

            </form>

          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" onclick=submitEditCompanyForm('${this.idCompany}') id="submitProfileForm" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
<!-- End modal -->

        </div>`
        view.appendHtml(companydetail, companyDetail)
}
view.disable = function (id) {
  document.getElementById(id).setAttribute('disabled', true)
}
view.enable = function (id) {
  document.getElementById(id).removeAttribute('disabled')
}
