const view = {
    currentScreen: null,
    lastScreen: null,
    pastScreen: null,
}

view.showComponents = async function(name) {
    view.currentScreen = name
    view.saveLastLocation(name)

    await controller.loadCompany()
    await controller.loadJob()


    switch (name) {
        case 'home':
            {
                // view.pastScreen = 'home'
                let currentUser = firebase.auth().currentUser
                console.log(currentUser)
                model.saveCurrentJobs(model.jobs)
                let app = document.getElementById('app')
                app.innerHTML = component.navTransf + component.header + component.home
                
                    // console.log(await controller.getTest())
                controller.listenConversation()
                
                view.onclickNotification()
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
                let test = {
                    verified: false,
                    email: null
                }

                if (!currentUser) {
                    test.emailVerified
                } else {
                    test.verified = currentUser.emailVerified
                }
                if (test.verified) {
                    console.log(test.verified)
                    registCompany.classList.add("disable-employer");
                    document.querySelector('.notification').style.display = "block"
                }
                let allconversation = await controller.getDataFireStore('conversations', 'users', 'array-contains')
                model.allConversation = []
                let conversations = []
                if (allconversation.length !== 0) {
                    for (let x of allconversation) {
                        conversations.push({
                            createdAt: controller.convertToTimeStamp(x.data().messages[x.data().messages.length - 1]['createdAt']),
                            messages: x.data().messages,
                            id: x.id,
                            users: x.data().users
                        })
                    }
                    console.log(conversations);
                    model.allConversation = controller.sortByTimeStamp(conversations)
                }
                view.showNotification()
                
                break;
            }
        case 'login':
            {

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
        case 'register':
            {

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
                            registerInfo.confirmPassword &&
                            registerInfo.confirmPassword.length >= 6 &&
                            registerInfo.password == registerInfo.confirmPassword,
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
        case 'companyDetail':
            {
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
                let test = {
                    verified: false,
                    email: null
                }

                if (!currentUser) {
                    test.emailVerified
                } else {
                    test.verified = currentUser.emailVerified
                }
                if (test.verified) {
                    console.log(test.verified)
                    registCompany.classList.add("disable-employer");
                    document.querySelector('.notification').style.display = "block"
                }

                break;
            }
        case 'alljob':
            {
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
                let test = {
                    verified: false,
                    email: null
                }

                if (!currentUser) {
                    test.emailVerified
                } else {
                    test.verified = currentUser.emailVerified
                }
                if (test.verified) {
                    console.log(test.verified)
                    registCompany.classList.add("disable-employer");
                    document.querySelector('.notification').style.display = "block"
                }

                break;
            }
        case 'profile':
            {
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
                console.log(avatarUploadForm)
                avatarUploadForm.onsubmit = async function(e) {
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
                cvUploadForm.onsubmit = async function(e) {
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

                break;
            }
        case 'loading':
            {
                let app = document.getElementById('app')
                app.innerHTML = component.loading
                break;
            }
        case 'registCompany':
            {
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
                        view.validate(registerInfo.nameCompany, 'nameCompany-error', 'Invalid name company!'),
                        view.validate(
                            registerInfo.email && registerInfo.email.includes('@'),
                            'email-error',
                            'Invalid email!'
                        ),
                        view.validate(registerInfo.addressCompany, 'addressCompany-error', 'Invalid address company!'),
                        view.validate(registerInfo.titleCompany, 'titleCompany-error', 'Invalid title company!'),
                        view.validate(
                            registerInfo.password && registerInfo.password.length >= 6,
                            'password-error',
                            'Invalid password!'
                        ),
                        view.validate(
                            registerInfo.confirmPassword &&
                            registerInfo.confirmPassword.length >= 6 &&
                            registerInfo.password == registerInfo.confirmPassword,
                            'confirm-password-error',
                            'Invalid confirm password!'
                        )
                    ]
                    if (allPassed(validateResult)) {
                        controller.registCompany(registerInfo)

                    }
                }
                document.getElementById('sign-in-regist-company').addEventListener('click', () => {
                    view.showComponents('loginCompany')
                })
                view.nextLink()
                break;
            }
        case 'loginCompany':
            {
                let app = document.getElementById('app')
                app.innerHTML = component.loginCompany
                let form = document.getElementById('login-employer')
                form.onsubmit = formSubmit
                view.nextLink()

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
        case 'employerScreen':
            {
                let app = document.getElementById('app')
                app.innerHTML = component.headerEmployer + component.detailEmployer
                await view.showCompanyDetailEmployer()
                document.getElementById('link-home-employer').addEventListener('click', () => {
                    view.showComponents('employerScreen')
                })
                document.getElementById('all-job-employer').addEventListener('click', () => {
                    view.showComponents('allJobOfCompany')
                })
                let LogoUploadForm = document.getElementById('logo-form-upload')
                console.log(LogoUploadForm)
                await controller.getNameCompanyCurrent()
                LogoUploadForm.onsubmit = async function(e) {
                    e.preventDefault()
                    try {
                        let files = LogoUploadForm.fileChooserLogo.files
                        let file = files[0]
                        if (!file) {
                            throw new Error('Choose a file!')
                        }
                        // upload to firebase + update 
                        await controller.uploadLogo(file)
                    } catch (err) {
                        alert(err.message)
                    }
                }
                view.nextLink()
                let BgUploadForm = document.getElementById('bg-form-upload')
                BgUploadForm.onsubmit = async function(e) {
                    e.preventDefault()
                    try {
                        let files = BgUploadForm.fileChooserBg.files
                        let file = files[0]
                        if (!file) {
                            throw new Error('Choose a file!')
                        }
                        // upload to firebase + update 
                        await controller.uploadBg(file)
                    } catch (err) {
                        alert(err.message)
                    }
                }
                break;
            }
        case 'allJobOfCompany':
            {
                let app = document.getElementById('app')
                app.innerHTML = component.headerEmployer + component.allJobOfCompany
                document.getElementById('link-home-employer').addEventListener('click', () => {
                    view.showComponents('employerScreen')
                })
                // view.showjobEmployer()
                controller.listenJobChange()
                let form = document.getElementById('form-postjob')
                form.onsubmit = postjobHandler
                
                function postjobHandler(event) {
            
                  event.preventDefault()
            
                  let job = {
                    userSaved: [],
                    nameCompany: form.nameCompany.value,
                    title: form.title.value,
                    money: form.money.value,
                    address: form.address.value,
                    skill: form.skill.value,
                    description: form.description.value,
                    SandE: form.SandE.value,
                    why: form.why.value,
                    createdAt: new Date().toLocaleString(),
                    timestamp:firebase.firestore.FieldValue.serverTimestamp()
                  }
                //   console.log(job);
            
            
                  let validateResult = [
                    view.validate(
                      job.nameCompany,
                      'job-nameCompany-error',
                      'Name comany is not empty!'
                    ),
                    view.validate(
                      job.title,
                      'job-title-error',
                      'Invalid title!'
                    ),
                    view.validate(
                      job.money && !isNaN(job.money),
                      'job-money-error',
                      'salary is suitable!'
                    ),
                    // view.validate(
                    //   !isNaN(job.money),
                    //   'job-money-error',
                    //   'is not a number!'
                    // ),
                    view.validate(
                      job.address,
                      'job-address-error',
                      'Invalid address!'
                    ),
                    view.validate(
                      job.skill,
                      'job-skill-error',
                      'Invalid employee!'
                    ),
                    view.validate(
                      job.description,
                      'job-description-error',
                      'Invalid description!'
                    ),
                    view.validate(
                      job.SandE,
                      'job-SandE-error',
                      'Invalid skill and expeience!'
                    ),
                    view.validate(
                      job.why,
                      'why-error',
                      'Empty!'
                    ),
                  ]
                  if (allPassed(validateResult)) {
                    controller.postjob(job)
                  }
                }
                break;
            }

        case 'companyEmployerdetail':
            {
                // view.pastScreen = 'companyEmployerdetail'
                // let currentUser = firebase.auth().currentUser
                let app = document.getElementById('app')
                app.innerHTML = component.headerEmployer + component.companyEmployerdetail
                await view.showJobDetailEmployer()
                controller.listenConversation()
                document.getElementById('link-home-employer').addEventListener('click', () => {
                    view.showComponents('employerScreen')
                })
                document.getElementById('all-job-employer').addEventListener('click', () => {
                    view.showComponents('allJobOfCompany')
                })
                // view.showJob()
                // view.showJobDetail()

                //chat box
                let allconversation = await controller.getDataFireStore('conversations', 'users', 'array-contains')
                console.log(allconversation);
                model.allConversation = []
                let conversations = []
                if (allconversation.length !== 0) {
                    for (let x of allconversation) {
                        conversations.push({
                            createdAt: controller.convertToTimeStamp(x.data().messages[x.data().messages.length - 1]['createdAt']),
                            messages: x.data().messages,
                            id: x.id,
                            users: x.data().users
                        })
                    }
                    console.log(conversations);
                    model.allConversation = controller.sortByTimeStamp(conversations)
                }
                
                break;
            }
        case 'savedJob': 
            {
                let currentUser = firebase.auth().currentUser
                let app = document.getElementById('app')
                app.innerHTML = component.navNoTransf + component.savedJob
                view.ShowNav()
                if (!currentUser) {
                    view.showComponents('home')
                }
                await controller.displaySavedJobs()
                let registCompany = document.getElementById('link-employer')
                let job = document.getElementById("link-job")
                job.onclick = function() {
                    view.showComponents("alljob")
                }
                let home = document.getElementById("link-home")
                home.onclick = function() {
                    view.showComponents("home")
                }
                let test = {
                    verified: false,
                    email: null
                }

                if (!currentUser) {
                    test.emailVerified
                } else {
                    test.verified = currentUser.emailVerified
                }
                if (test.verified) {
                    console.log(test.verified)
                    registCompany.classList.add("disable-employer");
                    document.querySelector('.notification').style.display = "block"
                }
                break;
            }
        case 'appliedJob':
            {
                let currentUser = firebase.auth().currentUser
                let app = document.getElementById('app')
                app.innerHTML = component.navNoTransf + component.appliedJob
                view.ShowNav()
                if (!currentUser) {
                    view.showComponents('home')
                }
                await controller.displayAppliedJobs()
                let registCompany = document.getElementById('link-employer')
                let job = document.getElementById("link-job")
                job.onclick = function() {
                    view.showComponents("alljob")
                }
                let home = document.getElementById("link-home")
                home.onclick = function() {
                    view.showComponents("home")
                }
        
                let test = {
                    verified: false,
                    email: null
                }
                if (!currentUser) {
                    test.emailVerified
                } else {
                    test.verified = currentUser.emailVerified
                }
                if (test.verified) {
                    console.log(test.verified)
                    registCompany.classList.add("disable-employer");
                    document.querySelector('.notification').style.display = "block"
                }
                break;
            }
    }
}
view.showCompany = function() {
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
view.showCompanyDetail = function() {
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
view.showJob = function() {

    let listJob = document.getElementById("listJob")
    let test = {
        verified: false
    }
    let currentUser = firebase.auth().currentUser
    if (!currentUser) {
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
view.showJobLong = function(seclecjob) {

    let showAlljob = document.getElementById('all-job')
    let test = {
        verified: false
    }
    let currentUser = firebase.auth().currentUser
    if (!currentUser) {
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
view.showJobDetail = async function() {
    let jobdetail = document.getElementById("clear")
    let test = {
        verified: false,
        email: null
    }
    let currentUser = await firebase.auth().currentUser

    if (!currentUser) {
        test.emailVerified
    } else {
        test.verified = currentUser.emailVerified
        test.email = currentUser.email
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
                                console.log(job.id)
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
                                      <button onclick="${test.verified ? await controller.appliedJob(job.id, test.email) : alert('You havent login') }">APPLY</button>
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
        skillTag.onclick = function(e) {
            console.log('click ', skill)
            e.preventDefault()
            linkJobDetail(skill)
        }
    }
}
view.saveLastLocation = function(screenName) {
    view.lastScreen = screenName
    window.location.hash = `#${screenName}`
}
view.showLastLocation = function(rollbackScreenName) {
    let lastLocation = view.getLastLocation()
    if (lastLocation) {
        view.showComponents(lastLocation)
    } else {
        view.showComponents(rollbackScreenName)
    }
}
view.getLastLocation = function() {
    let hash = window.location.hash
    let screenNames = ['register', 'login', 'home', 'companyDetail', 'alljob', 'profile', 'registCompany', 'loginCompany', 'employerScreen', 'allJobOfCompany', 'companyEmployerdetail', 'savedJob', 'appliedJob']
    if (hash && hash.length && hash.startsWith('#')) {
        let lastLocation = hash.substring(1)
        if (screenNames.includes(lastLocation)) {
            return lastLocation
        }
    }
    return null
}
view.inputSearch = function() {
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

view.ShowNavEmployer = function () {
    let link = document.getElementById("dropdown")
    let test = {
        verified: false
    }
    let currentUser = firebase.auth().currentUser
    if (currentUser) {
        test.verified = currentUser.emailVerified
    }
    if (test.verified === false) {
        return
    }
     view.clearHtml("dropdown")
    let btnSignOut = document.querySelector('#btn-out')
    link.innerHTML = component.dropdown
    view.setText('text-login', "ACC")
    btnSignOut.onclick = function() {
        firebase.auth().signOut()
    }
}

// các hàm tiện ích
view.ShowNav = function() {
    let link = document.getElementById("dropdown")
    let test = {
        verified: false
    }
    let currentUser = firebase.auth().currentUser
    if (currentUser) {
        test.verified = currentUser.emailVerified
    }
    if (test.verified === false) {
        return
    }
    view.clearHtml("dropdown")

    link.innerHTML = component.dropdown
    view.setText('text-login', "ACC")

    let profile = document.getElementById("btn-profile")
    profile.onclick = function() {
        view.showComponents("profile")
    }
    let registCompany = document.getElementById("link-employer")
    registCompany.onclick = function() {
        view.showComponents("registCompany")
    }
    document.querySelector('#btn-saved-job').addEventListener('click', ()=>{
        view.showComponents('savedJob')
    })
    document.querySelector('#btn-applied-job').addEventListener('click', ()=>{
        view.showComponents('appliedJob')
    })
    let btnSignOut = document.querySelector('#btn-out')
    btnSignOut.onclick = function() {
        firebase.auth().signOut()
    }
}
view.nextLink = function() {
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
    job.onclick = function() {
        view.showComponents("alljob")
    }
    let home = document.getElementById("link-home")
    home.onclick = function() {
        view.showComponents("home")
    }
}
view.clearHtml = function(id) {
    document.getElementById(id).innerHTML = ""
}
view.appendHtml = function(element, html) {
    element.innerHTML += html
}
view.setText = function(id, text) {
    document.getElementById(id).innerText = text
}
view.validate = function(condition, idErrorTag, messageError) {
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
view.showCompanyDetailEmployer = async function() {
    let companydetail = document.getElementById("detail")
    let currentUser = firebase.auth().currentUser
    let user = await firebase.firestore().collection('company').where("emailCompany", "==", currentUser.email).get()
    let u = transformDocs(user.docs)
    console.log(u[0].id)
    let companyDetail = ` 
        <div style="margin-right: 10px" class="logo-cty col-sm-3">
            <div>
                <img id="logo-test" style="max-width: 100%" src="${u[0].logo}" alt="">
                <form id = "logo-form-upload"> 
                    <input name="fileChooserLogo" type="file" class="file file-loading " 
                    data-allowed-file-extensions='["png", "jpg"]'> 
                    <button class="btn-submit-profile">Submit logo</button> 
                </form> 
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
                <img id="bg-test" style="max-width: 100%; border: 5px solid #C4C4C4;" src="${u[0].bg}" alt="">
                <form id = "bg-form-upload"> 
                  <input name="fileChooserBg" type="file" class="file file-loading" data-allowed-file-extensions='["png", "jpg"]'> 
                  <button class="btn-submit-profile">Submit</button> 
                </form> 
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
                    placeholder="${u[0].name}" value="${u[0].name}">
                </div>
              </div>

              <div class="form-group">
                <label class="col-xs-3 form-control-label" for="companyAddress">Address</label>
                <div class="col-xs-9">
                  <input type="text" class="form-control" name="companyAddress" placeholder="${u[0].address}" value="${u[0].address}">
                </div>
              </div>
                            
              <div class="form-group">
              <label class="col-xs-3 form-control-label" for="companyEmployee">Employee</label>
              <div class="col-xs-9">
              <input type="text" class="form-control" name="companyEmployee" placeholder="${u[0].employee}" value="${u[0].employee}">
              </div>
              </div>

              <div class="form-group">
              <label class="col-xs-3 form-control-label" for="companyTitle">Title</label>
              <div class="col-xs-9">
              <input type="text" class="form-control" name="companyTitle" placeholder="${u[0].title}" value="${u[0].title}">
              </div>
              </div>

              <div class="form-group">
              <label class="col-xs-3 form-control-label" for="companyDesc">Description</label>
              <div class="col-xs-9">
              <input type="text" class="form-control" name="companyDesc" placeholder="${u[0].description}" value="${u[0].description}">
              </div>
              </div>

            </form>

          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" onclick=submitEditCompanyForm('${u[0].id}') id="submitProfileForm" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
<!-- End modal -->

        </div>`
    view.appendHtml(companydetail, companyDetail)
}

function linkCompanyEmployerDetail(id) {
    model.saveId(id)
    localStorage.setItem('companyId', model.companyId);
    view.showComponents("companyEmployerdetail")
}
view.showJobDetailEmployer = async function() {
    model.companyId = localStorage.getItem("companyId")
    let jobdetail = document.getElementById("clear")
    let listCv = document.querySelector(".about")
    let test = {
        verified: false,
        email: null
    }
    let currentUser = await firebase.auth().currentUser

    if (!currentUser) {
        test.emailVerified
    } else {
        test.verified = currentUser.emailVerified
        test.email = currentUser.email
    }
    if (model.jobs) {
        jobs = model.jobs
        for (let job of jobs) {
            if (model.companyId) {
                companyId = model.companyId
                if (companyId === job.id) {
                    if (model.companys) {
                        companys = model.companys
                        for (let company of companys) {
                            if (company.name === job.nameCompany) {
                                


                                console.log(job.id)
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
                      <button class="btn-sj">Edit</button>
                     </div>
                 </div>
                 <div class="pl20">
                      <div>
                          <span style="color: #a50b0b" id="salary" class="fs20"><i class="fas fa-search-dollar fs20"></i> ${job.money}</span>
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

                  </div>
               </div>

              </div>
          </div>
          <span id='test-click' class="fw500 fs25">List user applied</span>
          `
                                view.appendHtml(jobdetail, jobDetail)
                                for (let i = 0; i < job.userApplied.length; i++) {
                                    let test = await controller.getCv(job.userApplied[i])
                                    let cv = `
                                    
<div id="commentsDetail"class="detail row" >     
<div class="about" style="min-height: auto; margin-bottom: 25px; width: 1030px;"> 
                <div class="img-jd inforCandidate" style="display: flex; ">
                <img style="width: 60px; height: 60px; border: 5px solid #dbdbf0; border-radius: 20%;" src="${test[0].avatarUrl}" alt="">
                <div style="padding: 1px; margin-left: 10px;">
                <div style="display:flex;" class="nameCandidate">
                    <h3 style="font-size: 18px; font-weight: bold; margin:3px 0px;">Name:</h3>
                    <p style="margin:3px 0px; font-size: 16; padding: 0px 5px;">${test[0].displayName}</p>
                </div>
                <div style="display:flex;" class="emailCandidate">
                    <h3 style="font-size: 18px;font-weight: bold;margin:3px 0px;">Email:</h3>
                    <p style="margin:3px 0px; font-size: 16; padding: 0px 5px;">${test[0].email}</p>                                      
                </div>
                <div style="display:flex;" class="cvCandidate">
                    <h3 style="font-size: 18px;font-weight: bold;margin:3px 0px;">CV:</h3>
                    <p style="margin:3px 0px; font-size: 16; padding: 0px 5px;">Cv1Cv1Cv1Cv1Cv1s.pdf</p>  
                    <div style=" padding-top: 3px;">
                       <a href="#" style="margin: 2px;"><i class="fas fa-eye"></i></a>
                       <a href="#" style="margin: 2px;"><i class="fa fa-download" aria-hidden="true"></i></a>
                       <button type="button" id='${test[0].email}' onclick="view.sendMessages('${test[0].email}')" class="btn btn-primary">Send message</button>
                    
                    </div> 
                </div>
                <a href="#">View profile</a> 
                </div>                   
            </div>
</div>
</div>
`
                                    view.appendHtml(jobdetail, cv)
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}
view.showjobEmployer =  async function() {
    let listJob = document.getElementById("job");
    listJob.innerHTML = "";
    let jobs = await controller.getNameCompanyCurrent();

    for (let job of jobs) {
        if (model.companys) {
            companys = model.companys
            for (let company of companys) {
                if (company.name == job.nameCompany) {
                    console.log(job.id)
                    let jobCompany = `
                <tr>
                    <td onclick=linkCompanyEmployerDetail('${job.id}') class="text-center"><a class="tblTitleJob">${job.title}</a></td>
                    <td class="text-center">${job.money}</td>
                    <td class="text-center">${job.skill}</td>
                    <td class="text-center"><span class="tbDueTime">20 December</span></td>
                    <td class="text-center">
                        <div class="btn-group-sm btn-group">
                            <button  onclick= controller.deleteJob('${job.id}') class="removeButton settingButton btn bg-danger"><i class="far fa-trash-alt"></i></button>
                            <button class="editButton settingButton btn bg-primary" style="margin-left: 5px;"><i class="fas fa-edit"></i></button>
                        </div>
                    </td>
                </tr>
 `              
                    view.appendHtml(listJob, jobCompany)
                }
            }
        }
    }
}
view.disable = function(id) {
    document.getElementById(id).setAttribute('disabled', true)
}
view.enable = function(id) {
    document.getElementById(id).removeAttribute('disabled')
}
function submitEditCompanyForm(id) {
    let companyId = id
    let formEdit = document.getElementById('editCompanyDetail')
    console.log(formEdit)
    controller.updateCompanyDetail(companyId, formEdit)
}
view.sendMessages = async  (id) => {
    let chatBox = document.querySelector('.chatBoxArea')
    chatBox.style.display = "block";
    let a = await controller.sendMessages(id)
    console.log(a)
    let data = await controller.findConversation(
        "conversations",
        "users",
        a.email
    );
    const messageBox = document.querySelector(".showMessagesDirect");
    if (data == undefined) {
        let key = controller.addFireStore("conversations", {
            createAt: new Date().toLocaleString(),
            messages: [
                {
                    content: "Hello",
                    createdAt: controller.getDate(),
                    owner: firebase.auth().currentUser.email,
                },
            ],
            users: [a.email, firebase.auth().currentUser.email],
        });
        let data2 = await controller.findConversation(
            "conversations",
            "users",
            a.email
        );
        console.log(data2)
        let friend = await controller.sendMessages(a.email);
        let html = "";
        if (data2.data().messages !== undefined) {
            for (let x of data2.data().messages) {
                if (x.owner == firebase.auth().currentUser.email) {
                    html += view.addYourMessage(x.content, x.createdAt);
                } else {
                    html += view.addFriendMessage(x.content, friend.avatarUrl);
                }
            }
        }
        console.log(html)
        messageBox.innerHTML = html;
    } else {
        let html = "";
        let friend = await controller.sendMessages(a.email);
        if (data.data().messages !== undefined) {
            for (let x of data.data().messages) {
                if (x.owner == firebase.auth().currentUser.email) {
                    html += view.addYourMessage(x.content, x.createdAt);
                } else {
                    html += view.addFriendMessage(x.content, friend.photoURL, x.createdAt);
                }
            }
            let chatTitle = document.querySelector(".showHeadLeft");
            chatTitle.innerHTML = `${friend.email}`;
            
        }
        model.currentConversation = {
            id: data.id,
        };
        console.log(model.currentConversation.id)
        console.log(html)

        messageBox.innerHTML = html;
        messageBox.scrollTop = messageBox.scrollHeight
    }
    let messageInput = document.getElementById("status_message");
    messageInput.addEventListener("keyup", (e) => {
        if (e.keyCode == "13") {
            if (model.currentConversation !== null) {
                if (messageInput.value.trim() !== "")
                    controller.firestoreArryUnion(
                        "conversations",
                        model.currentConversation.id,
                        messageInput.value
                    );
                messageInput.value = "";
            }
            else {
                alert('Please input your friend email to chat')
                messageInput.value = "";
            }
        }
    });
    // messageInput.addEventListener('click',()=>{
    //     if (model.currentConversation !== null) {
    //         let a = document.getElementById(`${model.currentConversation.id}`)
    //         a.style.fontWeight = "300";
    //         let iconMessage = document.querySelector(".icon-notification");
    //         iconMessage.style.display = "none";
    //         model.updateCheckConversation('conversations', model.currentConversation.id, true)
    //     }
    // })
    // const searchBar = document.getElementById("search-conversations");
    // searchBar.addEventListener("keyup", (e) => {
    //     const searchString = e.target.value.toLowerCase();
    //     document.querySelector(".new-notification").innerText = "";
    //     const filteredConversations = model.allConversation.filter(
    //         (conversation) => {
    //             return conversation.users
    //                 .find((item) => item !== firebase.auth().currentUser.email)
    //                 .toLowerCase()
    //                 .includes(searchString);
    //         }
    //     );
    //     console.log(filteredConversations);
    //     for (let index = 0; index < model.allConversation.length; index++) {
    //         console.log(model.allConversation[index].friendImg);
    //         if (filteredConversations[index] !== undefined) {
    //             view.addNotification(
    //                 filteredConversations[index],
    //                 filteredConversations[index].id,
    //                 filteredConversations[index].friendImg,
    //                 filteredConversations[index].friendEmail
    //             );
    //         }
    //     }
    // });
}
view.showNotification = () => {
    let messageInput = document.getElementById("status_message");
    messageInput.addEventListener('click',()=>{
        if (model.currentConversation !== null) {
            let a = document.getElementById(`${model.currentConversation.id}`)
            a.style.fontWeight = "300";
            let iconMessage = document.querySelector(".icon-notification");
            iconMessage.style.display = "none";
            model.updateCheckConversation('conversations', model.currentConversation.id, true)
        }
    })
    const searchBar = document.getElementById("search-conversations");
    searchBar.addEventListener("keyup", (e) => {
        const searchString = e.target.value.toLowerCase();
        document.querySelector(".new-notification").innerText = "";
        const filteredConversations = model.allConversation.filter(
            (conversation) => {
                return conversation.users
                    .find((item) => item !== firebase.auth().currentUser.email)
                    .toLowerCase()
                    .includes(searchString);
            }
        );
        console.log(filteredConversations);
        for (let index = 0; index < model.allConversation.length; index++) {
            console.log(model.allConversation[index].friendImg);
            if (filteredConversations[index] !== undefined) {
                view.addNotification(
                    filteredConversations[index],
                    filteredConversations[index].id,
                    filteredConversations[index].friendImg,
                    filteredConversations[index].friendEmail
                );
            }
        }
    });
}
view.addFriendMessage = (content, photoURL, date) => {
    let html = "";

        html = `
        <div class="messagesList">
        <div class="messagesListInfor">
            <span class="inforName senderName">Duc</span>
        </div>
        <img src="${photoURL}" alt="shiba" class="messagesImage fullLeft">
        <div class="messagesText">
            ${content}
        </div>
        <span class="messagesTimeStamp senderTimeLeft">${date}</span>
    </div>
        `;
    return html;
};
view.addYourMessage = (content, date) => {
    let html = "";
    html = `
    <div class="messagesList">
    <div class="messagesListInfor">
        <span class="inforName receiverName">You</span>
    </div>
    <div class="messagesText receiverText">
        ${content}
    </div>
    <span class="messagesTimeStamp receiverTimeRight">${date}</span>
</div>
    `;
    
    return html;
};
view.addListConversation = (data, isActive = false) => {
    let html = "";
    if (isActive) {
        if (
            data.check == false &&
            data.lassMessageOwner !== firebase.auth().currentUser.email
        ) {
            html += `
                <div class="conversation-box active bold">${data.friendEmail[0].toUpperCase()}
                ${data.friendEmail[
                    data.friendEmail.length - 11
                ].toUpperCase()}</div>
            `;
        } else {
            html += `
                <div class="conversation-box active">${data.friendEmail[0].toUpperCase()}
                ${data.friendEmail[
                    data.friendEmail.length - 11
                ].toUpperCase()}</div>
            `;
        }
    } else {
        if (
            data.check == false &&
            data.lassMessageOwner !== firebase.auth().currentUser.email
        ) {
            html += `
                <div class="conversation-box bold">${data.friendEmail[0].toUpperCase()}
                ${data.friendEmail[
                    data.friendEmail.length - 11
                ].toUpperCase()}</div>
            `;
        } else {
            html += `
                <div class="conversation-box ">${data.friendEmail[0].toUpperCase()}
                ${data.friendEmail[
                    data.friendEmail.length - 11
                ].toUpperCase()}</div>
            `;
        }
    }
    return html;
};
view.onclickNotification = () => {
    let notification = document.querySelector(".notification");
    let notificationBox = document.querySelector(".new-notification-box");
    notification.addEventListener("click", () => {
        notificationBox.classList.toggle("display-none");
    });
};
view.addNotification = async (data, id, friendImg, friendEmail) => {
    console.log(friendImg);
    lassMessageOwner = data.messages[data.messages.length - 1].owner;
    let notificationBox = document.querySelector(".new-notification");
    let html = "";
    let sender = null;
    // onclick='${view.sendMessages(friendEmail)}'
    lassMessageOwner == firebase.auth().currentUser.email
        ? (sender = "You:")
        : (sender = "");
    html = `
        <div class="sub-notification" id="${id}" >
            <div class="owner-notification">
                <img src="${friendImg}">
            </div>
            <div class="notification-box">
                <div class="text-email">${friendEmail}</div>
                <div class="content-notification text-email">${sender}
                    ${data.messages[data.messages.length - 1].content}
                </div>
            </div>
        </div>
    `;
    if (data.check == true) {
        notificationBox.insertAdjacentHTML("beforeend", html);
    } else notificationBox.insertAdjacentHTML("afterbegin", html);
    if (lassMessageOwner !== firebase.auth().currentUser.email) {
        if (model.currentConversation !== null) {
            if (id !== model.currentConversation.id && data.check == false) {
                let font = document.getElementById(`${id}`);
                let icon = document.querySelector(".icon-notification");
                font.style.fontWeight = "600";
                icon.style.display = "block";
            } else if (
                id == model.currentConversation.id &&
                data.check == false 
            ) {
                let font = document.getElementById(`${id}`);
                let icon = document.querySelector(".icon-notification");
                font.style.fontWeight = "600";
                icon.style.display = "block";
            }
        } else {
            if (data.check == false) {
                let font = document.getElementById(`${id}`);
                let icon = document.querySelector(".icon-notification");
                font.style.fontWeight = "600";
                icon.style.display = "block";
            }
        }
    }
    let a = document.getElementById(`${id}`);
    a.addEventListener("click", async () => {
        a.style.fontWeight = "300";
        model.currentConversation = {
            id: id,
            messages: data.messages[data.messages.length - 1].messages,
            users: data.users,
        };
        let chatBox = document.querySelector('.chatBoxArea')
        let messageBox = document.querySelector(".showMessagesDirect");
        
        console.log(messageBox)
        let html = "";
        controller.updateCheckConversation("conversations", id, true);
        for (let x of data.messages) {
            if (x.owner == firebase.auth().currentUser.email) {
                html += view.addYourMessage(x.content,x.createdAt);
            } else {
                html += view.addFriendMessage(x.content, friendImg, x.createdAt);
            }
        }

        messageBox.innerHTML = html;
        chatBox.style.display = 'block'
        let iconMessage = document.querySelector(".icon-notification");

        iconMessage.style.display = "none";
        let chatbox = document.querySelector(".showMessagesDirect");
        let notification = document.querySelector(".new-notification-box");
        chatbox.classList = ".showMessagesDirect";
        notification.classList = "new-notification-box display-none";
        let chatTitle = document.querySelector(".showHeadLeft");
        chatTitle.innerHTML = `${friendEmail}`;
        messageBox.scrollTop = messageBox.scrollHeight;
    });
    let messageInput = document.getElementById("status_message");
    messageInput.addEventListener("keyup", (e) => {
        if (e.keyCode == "13") {
            if (model.currentConversation !== null) {
                if (messageInput.value.trim() !== "")
                    controller.firestoreArryUnion(
                        "conversations",
                        model.currentConversation.id,
                        messageInput.value
                    );
                messageInput.value = "";
            }
            else {
                alert('Please input your friend email to chat')
                messageInput.value = "";
            }
        }
    });
};
view.addNewJob = (id,data) =>{
    const jobWrapper = document.createElement("tr");
    let listJob = document.getElementById('job')
    jobWrapper.innerHTML = `
    <td onclick=linkCompanyEmployerDetail('${id}') class="text-center"><a class="tblTitleJob">${data.title}</a></td>
    <td class="text-center">${data.money}</td>
    <td class="text-center">${data.skill}</td>
    <td class="text-center"><span class="tbDueTime">20 December</span></td>
    <td class="text-center">
        <div class="btn-group-sm btn-group">
            <button  onclick= "deleteDataFireStore('job', ${id})" class="removeButton settingButton btn bg-danger"><i class="far fa-trash-alt"></i></button>
            <button class="editButton settingButton btn bg-primary" style="margin-left: 5px;"><i class="fas fa-edit"></i></button>
        </div>
    </td>
`;
    document.querySelector('.removeButton').onclick = deleteDataFireStore('job', id)
    listJob.appendChild(jobWrapper)
    listJob.insertBefore(jobWrapper, listJob.childNodes[0]);
}
deleteDataFireStore = (collection, document) => {
    let db = firebase.firestore()
    db.collection(collection).doc(document).delete();
  }