
const model = {
  companys: null,
  companyId: null,
  jobs: null,
  currentJobs: null,
  currentUser: null,
  jobsCompany:null
}
model.currentUser=undefined

model.saveCompany = function (companys) {
  model.companys = companys
}
model.saveJob = function (jobs) {
  model.jobs = jobs
}
model.saveId = function (companyId) {
  model.companyId = companyId 
}
model.saveCurrentJobs = function (currentJobs) {
  model.currentJobs = currentJobs
}
model.saveJobsCompany = function (currentJobs) {
  model.jobsCompany = currentJobs
}


