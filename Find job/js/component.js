const component = {};
component.profile = `
<div class="container">
    <div class="about-company">
        <div class="pt30">
            <span class="fw500 fs25">MY PROFILE</span>
        </div>

        <div class="pt30">
            <button class="btn-edit" style="color: #8D8D8D;" data-toggle="modal" data-target="#exampleModal" id="btn-editProfile">
                <i class="far fa-edit" style="font-size:20px; width:40px"></i>Edit
            </button>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Edit</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="col-md-9">
                            <div class="edit-profile">

                                <form id="editProfileForm" method="post">
                                    <div class="form-group">
                                        <label class="col-xs-3 form-control-label" for="firstName">First
                                            name</label>
                                        <div class="col-xs-9">
                                            <input type="text" class="form-control" id="firstName" name="firstName"
                                                placeholder="Enter your first name">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-xs-3 form-control-label">Gender</label>
                                        <div class="col-xs-9 gender">
                                            <div class="row">
                                                <div class="col-md-5">
                                                    <label class="radio-inline">
                                                        <input type="radio" name="genderRadio" value="male">
                                                        <i class="fa fa-mars"
                                                            style="font-size:25px; width:40px; text-align: center;"></i><span>Male</span>
                                                    </label>
                                                </div>
                                                <div class="col-md-7">
                                                    <label class="radio-inline">
                                                        <input type="radio" name="genderRadio" value="female">
                                                        <i class="fa fa-venus"
                                                            style="font-size:25px; width:40px; text-align: center"></i><span>Female</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label class="col-xs-3 form-control-label" for="userSkills">Skills</label>
                                        <div class="col-xs-9">
                                            <input type="text" class="form-control" name="userSkills"
                                                placeholder="Available skills">
                                        </div>
                                    </div>

                                </form>

                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" id="submitProfileForm" class="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- End modal -->

        <!-- User Avatar -->

        <div class="avatar" id = "user-avatar-img">
        </div>

        <div class = "user-avatar-upload"> 

            <label class="col-xs-3 form-control-label" for="avatar">Choose 
            avatar 
            </label> 

            <div class="col-xs-9 abc"> 
                <!-- avatar button --> 
                <form id = "avatar-form-upload"> 
                    <input name="fileChooserAvatar" type="file" class="file file-loading " 
                    data-allowed-file-extensions='["png", "jpg"]'> 
                    <button class="btn-submit-profile">Submit Avatar</button> 
                </form> 
            </div> 
        </div>
        

        <!-- User info -->
        <div class="talc">
            <h3 id="user-name"></h3>
            <p><i id="user-gender" class="" style="font-size:30px; width:40px"></i></p>
            <p style="font-size:20px">My Email: <span style="font-weight:bold;font-size:20px" id="user-email"></span></p>
            <p style="font-size:20px">My Skills: <span style="font-weight:bold;font-size:20px" id="user-skills"></span></p>
            <p style="font-size:20px">My CV: <a href="" id ="user-cv-url" download target="_blank" style="font-weight:bold;font-size:20px" disabled>None</a></p>
            <!-- <span style="font-weight:bold;font-size:20px" id="user-cv-url"></span>  -->
        </div>

    </div>
    <div class="jobs">
        <div>
            <span class="fw500 fs24"><i class="far fa-address-card" style="font-size:30px; width:40px"></i>Upload Your CV</span>
        </div>

        <div>
            <form class="d" id = "cv-form-upload">
            <div>
                <input type="file" class="ip-cv" style="font-size:15px" name="fileChooser">
            </div>
            <div style="padding-top:20px">
                <button type="submit" class="btn-submit-profile" id="cv-submit" >Submit</button>
            </div>
            </form>
        </div>
    </div>
</div>
`
component.navTransf = `
<nav id="nav" class="navbar navbar-expand-sm fixed-top">
      <a id="logo" href="index.html" ><img src="imgs/img/logo.png" alt=""></a>
      <ul id="1" class="navbar-nav justify-content-end">
        <li id="home" class="nav-item">
          <span  class="nav-link clw" id="link-home">HOME</span>
        </li>
        <li id="alljob" class="nav-item">
          <span  class="nav-link clw"  id="link-job">ALL JOB</span>
        </li>
        <li class="nav-item">
          <a href="formpage.html"><span class="nav-link clw"  id="link-company" >CONTACT US</span></a>
        </li>
        <li id="employer" class="nav-item">
           <a class="nav-link clw" id="link-employer">EMPLOYER</a>
        </li>
        <div class="notification">
            <i style="font-size: 22px" class="far fa-envelope"></i>
            <div class="icon-notification"></div>
        </div>
        <div class="new-notification-box display-none">
            <div class="search-notification">
              <i class="fas fa-search"></i>
              <input id="search-conversations" type="text" placeholder="Search Conversations">
            </div>
        <div class="new-notification">

        </div>
        </div>
        <div id="dropdown">
          <div class="dropdown" style="width: 50px; height: 30px;margin: 0px 30px 0px 50px; text-align: center">
            <div type="button" data-toggle="dropdown">
                <i style="font-size: 22px" class="fas fa-user-circle"></i><span  id="next-login">Login</span>
            </div>
          </div>  
        </div>
    </ul>
</nav>
`

component.navNoTransf = `  <nav id="nav-b" class="navbar navbar-expand-sm fixed-top">
<a id="logo" href="index.html" ><img src="imgs/img/logotrang.png" alt=""></a>
<ul id="1" class="navbar-nav justify-content-end">
    <li class="nav-item">
        <a class="nav-link" id="link-home">HOME</a>
    </li>
    <li class="nav-item">
        <a class="nav-link "  id="link-job">ALL JOB</a>
    </li>

    <li class="nav-item">
         <a href="formpage.html"><span class="nav-link clw"  id="link-company" >CONTACT US</span></a>
    </li>
    <li class="nav-item">
         <a class="nav-link" id="link-employer">EMPLOYER</a>
    </li>
    <div id="dropdown">
    <div class="dropdown" style="width: 50px; height: 30px;margin: 0px 30px 0px 50px; text-align: center">
        <div type="button" data-toggle="dropdown">
            <i style="font-size: 22px" class="fas fa-user-circle"></i><span  id="next-login">login</span>
        </div>
      </div>  
    </div>
</ul>

</nav>`
component.dropdown = ` 
<div class="dropdown" style="width: 50px; height: 30px;margin: 0px 30px 0px 50px; text-align: center">
<div type="button" data-toggle="dropdown">
    <i style="font-size: 22px" class="fas fa-user-circle"></i><span id="text-login">login</span>
</div>
<div class="dropdown-menu dropdown-menu-right">
<a class="dropdown-item"  style="font-size: 20px" id="btn-profile">My Profile</a>
<a class="dropdown-item"  style="font-size: 20px" id="btn-applied-job">Applied Job</a>
<a class="dropdown-item"  style="font-size: 20px" id="btn-saved-job">Saved Job</a>
<a class="dropdown-item"  style="font-size: 20px" id="btn-out" >Log out</a>
</div>
</div> `

component.login = `
<div class="container">
    <form id="form-login">
        <div class="login-box">
            <div class="si-hd">
                <h3>SIGN IN</h3>
                <p>Sign in with Google</p>
            </div>
            <div class="btn-gg">
                <button><i class="fab fa-google" style="font-size:25px; width:50px;text-align:center"></i>Sign in with
                    Google</button>
                <p style="padding-top: 20px;">or</p>
            </div>
            <div class="lg-ip">
                <div class="inner-addon left-addon">
                    <i class="fas fa-envelope glyphicon glyphicon-user"
                        style="margin-top:5px; font-size: 20px;color: dimgray;"></i>
                    <input class="form-control" type="email" name="email" placeholder="Email" />
                    <div id="email-error" class="message-error"></div>
                </div>
                <div class="inner-addon left-addon">
                    <i class="fas fa-lock glyphicon glyphicon-user"
                        style="margin-top:5px; font-size: 20px;color: dimgray;"></i>
                    <input type="password" class="form-control" name="password" placeholder="Password" />
                    <div id="password-error" class="message-error"></div>
                </div>
                <div class="" style="height: 40px; text-align:right">
                    <div id="forgot" tpye="button" style=" font-size:18px">Forgot password?</div>
                </div>
            </div>
            <div id="log-in-error" class="message-error"></div>
            <div id="log-in-success" class="message-success"></div>
            <div class="btn-lg">
                <button type="submit" id="btn-login" class="blue">Login</button>
            </div>
            <div class="pt20">
                <a id="register-link"  style="color:#000000; font-size:18px">Register</a>
            </div>
        </div>
    </form>
    </div>`

component.register = `
<form id="form-register">
<div class="login-box">
    <div class="si-hd">
        <h3>SIGN UP</h3>
        <p>Sign Up with Google</p>
    </div>
    <div class="btn-gg">
        <button><i class="fab fa-google" style="font-size:25px; width:50px;text-align:center"></i>Sign in with Google</button>
        <p style="padding-top: 20px;">or</p>
    </div>
    <div class="lg-ip">
        <div class="inner-addon left-addon">
            <i class="fas fa-user glyphicon glyphicon-user"
                style="margin-top:5px; font-size: 20px;color: dimgray;"></i>
            <input class="form-control" type="text" name="fullname" placeholder="Fullname" />
            <div id="fullname-error" class="message-error"></div>
        </div>
        <div class="inner-addon left-addon">
            <i class="fas fa-envelope glyphicon glyphicon-user"
                style="margin-top:5px; font-size: 20px;color: dimgray;"></i>
            <input class="form-control" type="email" name="email" placeholder="Email" />
            <div id="email-error" class="message-error"></div>
        </div>
        <div class="inner-addon left-addon">
            <i class="fas fa-lock glyphicon glyphicon-user"
                style="margin-top:5px; font-size: 20px;color: dimgray;"></i>
            <input class="form-control" type="password" name="password" placeholder="Password" />
            <div id="password-error" class="message-error"></div>
        </div>
        <div class="inner-addon left-addon">
            <i class="fas fa-lock glyphicon glyphicon-user"
                style="margin-top:5px; font-size: 20px;color: dimgray;"></i>
            <input class="form-control" type="password" name="confirmPassword"
                placeholder="Re-Password" />
            <div id="confirm-password-error" class="message-error"></div>
        </div>
        <div class="" style="text-align:right">
            <a href="" style="color:#000000; font-size:18px">Forgot password?</a>
        </div>
    </div>
    <div id="register-error" class="message-error"></div>
    <div id="register-success" class="message-success"></div>
    <div class="btn-lg">
        <button type="submit" id="btn-register" class="blue">Sign Up</button>
    </div>
    <div class="pt20">
        <a id="login-link"  style="color:#000000; font-size:18px">Login</a>
    </div>
</div>
</form>
`

component.header = `<div class="bg" >
 <div class="content1">
   <div class="title">
     <h3> TECHFINDER</h1>
       <h5> THE LEADING WEBSITE FOR IT JOBFINDINGS</h4>
   </div>
 
   <form  id="form-search" class=" d-flex justify-content-center form-search">
     <span class=""
       style=" border-radius: 5px 0px 0px 5px;  background-color: white; height: 50px; width: 30px;color: #8D8D8D;font-size: 18px"><i
         style="padding-top:60%; font-size:20px; color:#C4C4C4" class="fa fa-search"></i></span>
     <input class="ip" name="search" type="search" style="font-size: 18px;" placeholder="Company,skill..." aria-label="Search" required>
     <div id="text-error" class="message-error"></div>
     <div class="form-group ">
 
    
       <select id="option-address" name="address" class="form-control form-control1 form-search ">
     
         
       </select>
     </div>
 
     <button class=" btnBg  form-search btn-hover" type="submit" style="font-size:20px"> <i class="fas fa-search " style="font-size:20px"></i> Search</button>
 
   </form>
 
   <div class="pt60 tk">
   
   </div>
   
   <div  class="d-flex justify-content-center " style="font-size:20px; color:#ffffff"> Job by skill</div>
   <div id="job-skill" class="d-flex justify-content-center mt-5 ">
     
   </div>
 </div>
 </div>
 </div>`
component.home =
    ` 
<div class="  text-job container ">
<h2> Nhà Tuyển Dụng </h2>
</div>
<div class="container">
<div id="listComponys" class="row mb-5 justify-content-center ">

</div>
<div class="chatBoxArea" id="myChatBox">
<div class="chatBoxShow">
    <!--Chat Box Header-->
    <div class="chatBoxShowHead">
        <div class="showHeadLeft"><img src="" alt="shiba" style="width: 60px; height: 60px; border: 5px solid #dbdbf0; border-radius: 20%;"></div>
        <div class="showHeadRight">
            <button type="button" class="btn btnCancel" id="closeform"><i class="fas fa-power-off"></i></button>
        </div>
    </div>
    <!--Chat Box Messages-->
    <div class="showMessages">
        <div class="showMessagesDirect">

        </div>
    </div>
    <!--Chat Box Footer-->
    <div class="chatBoxFooter">
        <div>
            <input id="status_message" placeholder="Type a message..." name="message"/>
        </div>
        <div class="btnFooter">
            <div class="btnFooterLeft">
                <button class="btnItems"><i class="fas fa-file"></i></button>
                <button class="btnItems"><i class="fas fa-image"></i></button>
                <button class="btnItems"><i class="fas fa-video"></i></button>
            </div>
        </div>
    </div>
</div>
</div>
</div>


`

component.companydetail = ` 
<div class="container" id="clear">
<div class="about-company">
<div class="pt30">
    <span class="fw500 fs25">ABOUT COMPANY</span>
</div>
<div id="companyDetail"class="detail row">
   
</div>
</div>
<div class="jobs">
<div>
    <span class="fw500 fs25">JOBS</span>
</div>
<div>
    <div id="listJob" class="job row">
        
      
</div>
</div>
</div>
</div> `

component.alljob = `
<div class="  text-job container ">
        <h2> JOBS </h2>
    </div>
    <div class="filter container">
        <div style="display: flex; justify-content: center; padding-top: 46px" class="row">
            <div style="padding: 0px" class="filter-main col-sm-3">
                <div style="max-width: 100%; padding: 15px 35px 10px 50px ; border-bottom: 2px solid #013B80">
                    <span style="font-size: 25px">Filter</span>
                </div>

                <div style="padding: 15px 35px 10px 50px">
                    <div id="option-checkbox" style="border-bottom: 1px solid #cccccc; padding: 10px ">
                        <div style="padding-bottom: 10px">
                            <span style="font-size: 20px">City</span>
                        </div>
                        <div class="form-check">
                            <label class="form-check-label">
                                <input id="all" type="checkbox" class="form-check-input">All
                            </label>
                        </div>
                        
                    </div>
                    <div style=" padding: 10px ">
                        <div style="padding-bottom: 10px">
                            <span style="font-size: 20px">Salary</span>
                        </div>
                        <div class="form-check">
                            <label class="form-check-label">
                                <input id="all1" type="checkbox" class="form-check-input">All
                            </label>
                        </div>
                        <div class="form-check">
                            <label class="form-check-label">
                                <input type="checkbox" name="checkbox1" class="form-check-input" value="duoi1000"><1000$
                            </label>
                        </div>
                        <div class="form-check">
                            <label class="form-check-label">
                                <input type="checkbox" name="checkbox1" class="form-check-input" value="tu1000den2000">1000$-2000$
                            </label>
                        </div>
                        <div class="form-check">
                            <label class="form-check-label">
                                <input type="checkbox" name="checkbox1" class="form-check-input" value="tren2000">>2000$
                            </label>
                        </div>
                    </div>

                </div>

                <div style="display: flex; justify-content: center; padding: 60px">
                    <button onclick="controller.checkbox()" class="filter-btn">Search</button>
                </div>
            </div>
            <div id="all-job" style="padding: 0px" class="filter-result col-sm-8">

            </div>
        </div>
    </div>
`
component.registCompany = `
<div class="container">
<div class="side-left-regist-company">
<p id="title-regist-company">Already a customer?</p>
<p id="sign-in-regist-company">> Sign in</p>
</div>
<h2>HI!</h2>
<h2>Want great IT candidates?</h2>
<p>Give us your details and our Customer Love team will contact you about our service!</p>
<!-- Trigger the modal with a button -->
<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#modalContactForm">Yes, I want great IT candidates!</button>

<!-- Modal -->
<form id="regist-company">
<div class="modal fade" id="modalContactForm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
  aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header text-center">
        <h4 class="modal-title w-100 font-weight-bold">We love meeting new people. :)</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body mx-3">
        <div class="md-form mb-5">
          <label data-error="wrong" data-success="right" for="form29">Your name company</label>
          <input type="text" id="form29" name="nameCompany" class="form-control validate">
          <div id="nameCompany-error" class="message-error"></div>
        </div>
        <div class="md-form mb-5">
          <label>address</label>
          <input type="text" id="form29" name="addressCompany" class="form-control validate">
          <div id="addressCompany-error" class="message-error"></div>
        </div>
        <div class="md-form mb-5">
          <label>Title company</label>
          <input type="text" id="form29" name="titleCompany" class="form-control validate">
          <div id="titleCompany-error" class="message-error"></div>
        </div>
        <div class="md-form mb-5">
          <label>Your name</label>
          <input type="text" id="form29" name="nameEmployer" class="form-control validate">
          <div id="nameE-error" class="message-error"></div>
        </div>

        <div class="md-form mb-5">
          <label data-error="wrong" data-success="right" for="form29">Your email company</label>
          <input type="email" name="email" id="form29" class="form-control validate">
          <div id="email-error" class="message-error"></div>
        </div>

        <div class="md-form mb-5">
          <label data-error="wrong" data-success="right" for="form32">password</label>
          <input type="password" name="password" id="form32" class="form-control validate">
          <div id="password-error" class="message-error"></div>
        </div>

        <div class="md-form mb-5">
          <label data-error="wrong" data-success="right" for="form32">re-password</label>
          <input type="password" name="confirmPassword" id="form32" class="form-control validate">
          <div id="confirm-password-error" class="message-error"></div>
        </div>

        <div class="md-form">
          <label data-error="wrong" data-success="right" for="form8">Your message</label>
          <textarea type="text" id="form8" class="md-textarea form-control" rows="4"></textarea>
        </div>
        <div id="register-error" class="message-error"></div>
        <div id="register-success" class="message-error"></div>
      </div>
      <div class="modal-footer d-flex justify-content-center">
        <button class="btn btn-unique" id="btn-register">Send <i class="fas fa-paper-plane-o ml-1"></i></button>
      </div>
    </div>
  </div>
</div>
</form>
`
component.loginCompany = `
<nav id="nav-b" class="navbar navbar-expand-sm fixed-top">
<a id="logo" href="index.html" ><img src="imgs/img/logotrang.png" alt=""></a>


</nav>
<div class="wrapper fadeInDown">
<div id="formContent">
  <!-- Tabs Titles -->
  <h2>Hire the best</h2>
  <!-- Login Form -->
  <form id="login-employer">
    <input type="text" id="login" class="fadeIn second" name="loginEmail" placeholder="login">
    <div id="email-error" class="message-error"></div>
    <input type="password" id="password" class="fadeIn third" name="loginPassword" placeholder="password">
    <div id="password-error" class="message-error"></div>
    <button type="submit">Login</button>
  </form>
  <div id="log-in-error" class="message-error"></div>

  <!-- Remind Passowrd -->
  <div id="formFooter">
    <a class="underlineHover" href="#">Forgot Password?</a>
  </div>

</div>
</div>
`
component.employer = `
<nav id="nav-b" class="navbar navbar-expand-sm fixed-top">
<a id="logo" href="index.html" ><img src="imgs/img/logotrang.png" alt=""></a>
<ul id="1" class="navbar-nav justify-content-end">
    <li class="nav-item">
        <a class="nav-link" id="link-home">HOME</a>
    </li>
    <li class="nav-item">
        <a class="nav-link "  id="link-job">ALL JOB</a>
    </li>

    <li class="nav-item">
         <a href="formpage.html"><span class="nav-link clw"  id="link-company" >CONTACT US</span></a>
    </li>
    <li class="nav-item">
         <a class="nav-link" id="link-employer">EMPLOYER</a>
    </li>
    <div id="dropdown">
    <div class="dropdown" style="width: 50px; height: 30px;margin: 0px 30px 0px 50px; text-align: center">
        <div type="button" data-toggle="dropdown">
            <i style="font-size: 22px" class="fas fa-user-circle"></i><span  id="next-login">login</span>
        </div>
      </div>  
    </div>
</ul>

</nav>
`
component.headerEmployer = `
<nav id="nav-b" class="navbar navbar-expand-sm fixed-top">
<a id="logo" href="#" ><img src="imgs/img/logotrang.png" alt=""></a>
<ul id="1" class="navbar-nav justify-content-end">
    <li class="nav-item">
        <a class="nav-link" id="link-home-employer">HOME</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" id="all-job-employer">ALL JOB</a>
    </li>
    <li class="nav-item">
        <a class="nav-link "  id="link-job">POST JOB</a>
    </li>
    <div id="dropdown">
    <div class="dropdown" style="width: 50px; height: 30px;margin: 0px 30px 0px 50px; text-align: center">
        <div type="button" data-toggle="dropdown">
            <i style="font-size: 22px" class="fas fa-user-circle"></i><span  id="next-login">login</span>
        </div>
      </div>  
    </div>
</ul>
</nav>
`
component.detailEmployer = ` 

<div id="clear" class="container" >
<div class="about-company">
<div class="pt30">
    <span class="fw500 fs25">ABOUT COMPANY</span>
</div>
<div id="detail"class="detail row">
   
</div>
</div>
<div class="jobs">
<div>
   
</div>
<div>
   
        
      
</div>
</div>
</div>
</div> `
component.allJobOfCompany = `
<div class="row">
<div class="col-md-12 col-12 " style="margin: 80px 200px 30px 10px;">
    <div class="searchBar row">
        <input type="text" class="searchInput" placeholder="Searching here">
        <button type="submit" class="searchButton">
                <i class="fa fa-search"></i>
            </button>
        </div>

        <div class="  text-job container " style="display:flex; justify-content: space-between;">
            <div class="col-sm-3">
                <h2> Nhà Tuyển Dụng </h2>
            </div>

            <div class="modal fade" id="myModal" role="dialog">
                <div class="modal-dialog">

                    <!-- Modal content-->
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2 class="modal-title">Add a new job</h2>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="inputJobForm">
                                <form>
                                    <div class="form-group">
                                        <label for="inputTitle">JOB TITLE</label>
                                        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
                                    </div>
                                    <div class="form-group">
                                        <label for="inputJobType">JOB TYPE</label>
                                        <div class="selectWrapper">
                                            <select class="form-control" id="inputJobType">
                                                <option>JAVA SPRING</option>
                                                <option>.NET</option>
                                                <option>FULL STACK JS</option>
                                                <option>PHP</option>
                                                <option>OTHER</option>
                                                <option>JAVA SPRING</option>
                                                <option>.NET</option>
                                                <option>FULL STACK JS</option>
                                                <option>PHP</option>
                                                <option>OTHER</option>
                                               
                                              </select>
                                        </div>

                                    </div>
                                    <div class="form-group">
                                        <label for="inputSalary">SALARY</label>
                                        <input type="text" class="form-control" id="inputSalary" placeholder="Ex:100$">
                                    </div>
                                    <div class="form-group">
                                        <label for="inputDueDate">DUE DATE</label>
                                        <input type="date" class="form-control" id="inputDueDate">
                                    </div>
                                    <div class="form-group">
                                        <label for="inputLocation">Location</label>
                                        <select class="form-control" id="inputLocation">
                                          <option>HA NOI</option>
                                          <option>DA NANG</option>
                                          <option>HO CHI MINH</option>
        
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="inputDescription">Description</label>
                                        <textarea class="form-control" id="inputDescription" rows="3"></textarea>
                                    </div>
                                    <button type="submit" class="btn btn-primary">Submit</button>
                                </form>

                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </div>

                </div>
            </div>

            <div class="col-sm-3 addNewArea text-center">
                <button class="editButton settingButton btn bg-success" style="margin-left: 5px;" data-toggle="modal" data-target="#myModal">Add new</button>
            </div>
        </div>
        <table class="table table-bordered" id="employersTab">
            <thead>
                <tr>
                    <th scope="col" class="tbJobName text-center">Job Title</th>
                    <th scope="col" class="tbSalary text-center">Salary</th>
                    <th scope="col" class="tbJobType text-center">Type of Job</th>
                    <th scope="col" class="tbJobDueTime text-center">Due Date</th>
                    <th scope="col" class="text-center"><i class="fa fa-gear"></i></th>
                </tr>
            </thead>
            <tbody id='job'>

            </tbody>
        </table>
        <div class="col-sm-12 col-12 row" style="justify-content: space-between;">
            <div class="col-sm-5">
                <div class="dataTables_Info" id="example_Info" role="status" aria-live="polite">Showing 1 to 4 of 57 entries</div>
            </div>

            <div class="col-sm-7">
                <div class="dataTables_Paginate" id="example_Paginate">
                    <ul class="pagination">
                        <li class="paginationButton" id="example_Previous">
                            <a href="#" data-dt-idx="1" class="pageLink" tabindex="1">Previous</a>
                        </li>
                        <li class="paginationButton pageItem active">
                            <a href="#" data-dt-idx="2" class="pageLink" tabindex="2">1</a>
                        </li>
                        <li class="paginationButton">
                            <a href="#" data-dt-idx="3" class="pageLink" tabindex="3">2</a>
                        </li>
                        <li class="paginationButton">
                            <a href="#" data-dt-idx="4" class="pageLink" tabindex="4">3</a>
                        </li>
                        <li class="paginationButton">
                            <a href="#" data-dt-idx="5" class="pageLink" tabindex="5">Next</a>
                        </li>
                        <li class="paginationButton" id="example_Next"></li>
                    </ul>
                </div>
            </div>
        </div>



    </div>
</div>
`
component.companyEmployerdetail = ` 
<div class="container" id="clear">
<div class="chatBoxArea" id="myChatBox">
<div class="chatBoxShow">
    <!--Chat Box Header-->
    <div class="chatBoxShowHead">
        <div class="showHeadLeft"><img src="" alt="shiba" style="width: 60px; height: 60px; border: 5px solid #dbdbf0; border-radius: 20%;"></div>
        <div class="showHeadRight">
            <button type="button" class="btn btnCancel" id="closeform"><i class="fas fa-power-off"></i></button>
        </div>
    </div>
    <!--Chat Box Messages-->
    <div class="showMessages">
        <div class="showMessagesDirect">

        </div>
    </div>
    <!--Chat Box Footer-->
    <div class="chatBoxFooter">
        <div>
            <input id="status_message" placeholder="Type a message..." name="message"/>
        </div>
        <div class="btnFooter">
            <div class="btnFooterLeft">
                <button class="btnItems"><i class="fas fa-file"></i></button>
                <button class="btnItems"><i class="fas fa-image"></i></button>
                <button class="btnItems"><i class="fas fa-video"></i></button>
            </div>
        </div>
    </div>
</div>
</div>
</div>
`
component.detailJobEmployer = `

`
component.savedJob = `
<div class="container-fluid " id="clear">
<div class="row-saved-job">
    <div class="col-md-12 col-12 " style="margin: 80px 200px 30px 10px;">
        <div class="searchContainer col-md-12 col-12">
            <form class="">
                <input id="search-saved-job" type="text" placeholder="Search.." name="search">
                <button><span>Search</span></button>
            </form>

        </div>
    </div>
    <div class="col-md-12 col-12">
        <h1 id='number-of-job' style="margin-left:200px ;"></h1>
        <div class="savedjobsContainer">
            <div class="col-md-7 jobGroup">

            </div>
            <div class="col-sm-7">
                <div class="dataTables_Paginate" id="example_Paginate">
                    <ul class="pagination">
                        <li class="paginationButton pageItem active">
                            <a href="#" data-dt-idx="2" class="pageLink" tabindex="2">1</a>
                        </li>
                        <li class="paginationButton">
                            <a href="#" data-dt-idx="3" class="pageLink" tabindex="3">2</a>
                        </li>
                        <li class="paginationButton">
                            <a href="#" data-dt-idx="4" class="pageLink" tabindex="4">3</a>
                        </li>
                        <li class="paginationButton">
                            <a href="#" data-dt-idx="5" class="pageLink" tabindex="5">Next</a>
                        </li>
                        <li class="paginationButton" id="example_Next"></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>


</div>


</div>
`
component.detailJobEmployer = `

`

component.appliedJob = `
<div class="container-fluid " id="clear">
<div class="row-saved-job">
    <div class="col-md-12 col-12 " style="margin: 80px 200px 30px 10px;">
        <div class="searchContainer col-md-12 col-12">
            <form class="">
                <input id="search-saved-job" type="text" placeholder="Search.." name="search">
                <button><span>Search</span></button>
            </form>

        </div>
    </div>
    <div class="col-md-12 col-12">
        <h1 id='number-of-job' style="margin-left:200px ;"></h1>
        <div class="savedjobsContainer">
            <div class="col-md-7 jobGroup">

            </div>
            <div class="col-sm-7">
                <div class="dataTables_Paginate" id="example_Paginate">
                    <ul class="pagination">
                        <li class="paginationButton pageItem active">
                            <a href="#" data-dt-idx="2" class="pageLink" tabindex="2">1</a>
                        </li>
                        <li class="paginationButton">
                            <a href="#" data-dt-idx="3" class="pageLink" tabindex="3">2</a>
                        </li>
                        <li class="paginationButton">
                            <a href="#" data-dt-idx="4" class="pageLink" tabindex="4">3</a>
                        </li>
                        <li class="paginationButton">
                            <a href="#" data-dt-idx="5" class="pageLink" tabindex="5">Next</a>
                        </li>
                        <li class="paginationButton" id="example_Next"></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>


</div>


</div>
`
component.loading = `
<section>
  Loading...
</section>
`