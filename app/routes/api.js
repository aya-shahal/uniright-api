let router = require("express").Router();


router.post("/user/forgot", UserController.forgotpassword);
router.post("/resetnewpassword", UserController.resetnewpassword);
// admin


/// user manager
router.post("/admin/login", AdminController.managerlogin);
router.get("/admin/managertype/list",AdminController.listmanagertype);
router.get("/admin/manager/list",AdminController.listmanager);

router.post("/admin/manager/save", AdminController.managerAddorUpdate);
router.get("/admin/manager/delete/:id", AdminController.adminmanagerdelete);

router.get("/admin/reported/list",AdminController.listreporteduser);
router.get("/admin/reportedmsg/list",AdminController.listreportedmsguser);

router.get("/admin/user/list",AdminController.listuser);
router.get("/admin/user/delete/:id", AdminController.adminuserdelete);
router.get("/admin/manager/delete/:id", AdminController.adminmanagerdelete);

router.post("/admin/user/save", AdminController.userAddorUpdate);

///////////////// ON BOARDING

router.post("/user/save", UserController.createuser);

router.post("/user/updateprofile",JwtAuth, UserController.updateprofile);

router.post("/user/verify", UserController.verifyuser);




router.get("/user/notification",JwtInfo, HomeController.listusernotifications);
router.post("/home/contact/save", HomeController.savecontact);



// news
router.get("/admin/news/list",JwtAuth, AdminController.adminlistnews);
router.post("/admin/news/save",JwtAuth, AdminController.newsAddorUpdate);
router.get("/admin/news/delete/:id",JwtAuth, AdminController.adminnewsdelete);

//classx
router.get("/admin/classx/list",JwtAuth, AdminController.adminlistclassx);
router.post("/admin/classx/save",JwtAuth, AdminController.classxAddorUpdate);
router.get("/admin/classx/delete/:id",JwtAuth, AdminController.adminclassxdelete);


router.get("/admin/notification/list",JwtAuth, AdminController.adminlistnotiication);
router.get("/admin/notification/delete/:id",JwtAuth, AdminController.adminnotificationdelete);
router.post("/admin/notification/save",JwtAuth, AdminController.notificationAddorUpdate);



router.get("/admin/managertype/list",JwtAuth, AdminController.adminlistmanagertpye);
router.get("/admin/managertype/delete/:id",JwtAuth, AdminController.adminmanagertypedelete);
router.post("/admin/managertype/save", AdminController.managertypeAddorUpdate);
//matier
router.get("/admin/matier/list",JwtAuth, AdminController.adminlistmatier);
router.post("/admin/matier/save",JwtAuth, AdminController.matierAddorUpdate);
router.get("/admin/matier/delete/:id",JwtAuth, AdminController.adminmatierdelete);

//teacher matier
router.get("/admin/teachermatier/list",JwtAuth, AdminController.adminlistteachermatier);
router.post("/admin/teachermatier/save",JwtAuth, AdminController.teachermatierAddorUpdate);
router.get("/admin/teachermatier/delete/:id",JwtAuth, AdminController.adminteachermatierdelete);

//grade
router.get("/admin/grade/list", AdminController.adminlistgrade);
router.post("/admin/grade/save", AdminController.gradeAddorUpdate);
router.get("/admin/grade/delete/:id",JwtAuth, AdminController.admingradedelete);



//calendar
router.get("/admin/calendar/list",JwtAuth, AdminController.adminlistcalendar);
router.post("/admin/calendar/save",JwtAuth, AdminController.calendarAddorUpdate);
router.get("/admin/calendar/delete/:id",JwtAuth, AdminController.admincalendardelete);


//agenda
router.get("/admin/agenda/list",JwtAuth, AdminController.adminlistagenda);
router.post("/admin/agenda/save",JwtAuth, AdminController.agendaAddorUpdate);
router.get("/admin/agenda/delete/:id",JwtAuth, AdminController.adminagendadelete);


//attendance
router.get("/admin/attendance/list",JwtAuth, AdminController.adminlistattendance);
router.post("/admin/attendance/save",JwtAuth, AdminController.attendanceAddorUpdate);
router.get("/admin/attendance/delete/:id",JwtAuth, AdminController.adminattendancedelete);



//nurse
router.get("/admin/nurse/list",JwtAuth, AdminController.adminlistnurse);
router.post("/admin/nurse/save",JwtAuth, AdminController.nurseAddorUpdate);
router.get("/admin/nurse/delete/:id",JwtAuth, AdminController.adminnursedelete);


// fees
router.get("/admin/fees/list",JwtAuth, AdminController.adminlistfees);
router.post("/admin/fees/save",JwtAuth, AdminController.feestransferAddorUpdate);
router.get("/admin/fees/delete/:id",JwtAuth, AdminController.adminfeesdelete);


// logs
router.get("/admin/logs/list",JwtAuth, AdminController.adminlistlogs);

// form
router.get("/admin/form/list", AdminController.adminlistformuestion);
router.post("/admin/form/save", AdminController.formAddorUpdate);
router.get("/admin/form/delete/:id", AdminController.adminformdelete);

router.get("/admin/formresponse/list", AdminController.adminlistformuestionresponse);
router.get("/admin/formresponse/delete/:id", AdminController.adminformresponsedelete);


router.get("/home/form/:id", JwtInfo,HomeController.forminfo);
router.post("/user/form/save",JwtAuth, UserController.submitformAddorUpdate);

// account
router.get("/admin/account/list",JwtAuth, AdminController.adminlistaccount);
router.post("/admin/account/save",JwtAuth, AdminController.accountAddorUpdate);
router.get("/admin/account/delete/:id",JwtAuth, AdminController.adminaccountdelete);


// feestype
router.get("/admin/feestype/list",JwtAuth, AdminController.adminlistfeestype);
router.post("/admin/feestype/save",JwtAuth, AdminController.feestypeAddorUpdate);
router.get("/admin/feestype/delete/:id",JwtAuth, AdminController.adminfeestypedelete);


// health
router.get("/admin/health/list",JwtAuth, AdminController.adminlisthealth);
router.post("/admin/health/save",JwtAuth, AdminController.healthAddorUpdate);
router.get("/admin/health/delete/:id",JwtAuth, AdminController.adminhealthdelete);


// health type
router.get("/admin/healthtype/list",JwtAuth, AdminController.adminlisthealthtype);
router.post("/admin/healthtype/save",JwtAuth, AdminController.healthtyprAddorUpdate);
router.get("/admin/healthtype/delete/:id",JwtAuth, AdminController.adminhealthtypedelete);





//exam
router.get("/admin/exam/list",JwtAuth, AdminController.adminlistexam);
router.post("/admin/exam/save",JwtAuth, AdminController.examAddorUpdate);
router.get("/admin/exam/delete/:id",JwtAuth, AdminController.adminexamdelete);


router.post("/admin/uploaditem/save", AdminController.itemupload);
router.post("/admin/uploaditemquiz/save", AdminController.uploaditemquiz);


//parent
router.get("/admin/parent/list",JwtAuth, AdminController.adminlistparent);
router.post("/admin/parent/save",JwtAuth, AdminController.parentAddorUpdate);
router.get("/admin/parent/delete/:id",JwtAuth, AdminController.adminparentxdelete);
//student
router.get("/admin/student/list",JwtAuth, AdminController.adminliststudent);
router.post("/admin/student/save", AdminController.studentAddorUpdate);
router.get("/admin/student/delete/:id",JwtAuth, AdminController.adminstudentxdelete);

//teacher
router.get("/admin/teacher/list",JwtAuth, AdminController.adminlistteacher);
router.post("/admin/teacher/save",JwtAuth, AdminController.teacherAddorUpdate);
router.get("/admin/teacher/delete/:id",JwtAuth, AdminController.adminteacherxdelete);


/// admin
router.get("/admin/settings",JwtAuth,AdminController.admingetsettings);
router.post("/admin/settings/save",JwtAuth,AdminController.adminsavesettings);


// app


router.get("/user/read/:id",JwtAuth, HomeController.readstory);
router.get("/user/marklastmessage/:story/:id",JwtAuth, HomeController.marklastread);
router.get("/user/profile/:id",JwtAuth, HomeController.myprofile)

router.get("/user/search/:key", JwtInfo,HomeController.searchstory);
router.get("/user/myview",JwtAuth, HomeController.myviewedstories);




router.get("/user/togglefollow/:id", JwtAuth,HomeController.userfollowmanage)
router.get("/user/togglebookmark/:id", JwtAuth,HomeController.userfollowmanage)



// banner
router.get("/admin/banner/list", AdminController.adminlistbanner);
router.post("/admin/banner/save", AdminController.bannerAddorUpdate);
router.get("/admin/banner/delete/:id", AdminController.admindeletebanner);

// book
router.get("/admin/book/list", AdminController.adminlistbbook);
router.post("/admin/book/save", AdminController.bookAddorUpdate);
router.get("/admin/book/delete/:id", AdminController.admindeletebook);


// university
router.get("/admin/university/list", AdminController.adminlistschool);
router.post("/admin/university/save", AdminController.schoolAddorUpdate);
router.get("/admin/university/delete/:id", AdminController.schooldeletebanner);

// department
router.get("/admin/department/list", AdminController.adminlistdepartment);
router.post("/admin/department/save", AdminController.departmentAddorUpdate);
router.get("/admin/department/delete/:id", AdminController.departmentdeletebanner);


// certificate
router.get("/admin/certificate/list", AdminController.adminlistcertificate);
router.post("/admin/certificate/save", AdminController.certificateAddorUpdate);
router.get("/admin/certificate/delete/:id", AdminController.schooldeletecertificate);

// certificate
router.get("/admin/filtercertificate/:id", AdminController.filteradminlistcertificate);

// schedule
router.get("/admin/schedule/list", AdminController.adminlistschedule);
router.post("/admin/schedule/save", AdminController.scheduleAddorUpdate);
router.get("/admin/schedule/delete/:id", AdminController.scheduledeletecertificate);

// studentclassprogress
router.get("/admin/studentclassprogress/list", AdminController.adminliststudentclassprogress);
router.post("/admin/studentclassprogress/save", AdminController.studentclassProgressAddorUpdate);
router.get("/admin/studentclassprogress/delete/:id", AdminController.studentclassprogressdeletecertificate);


// section
router.get("/admin/section/list", AdminController.adminlistsection);
router.post("/admin/section/save", AdminController.sectionAddorUpdate);
router.get("/admin/section/delete/:id", AdminController.sectiondeletebanner);



router.post("/user/login", UserController.userlogin);
router.get("/user/banner", HomeController.listbanner);
router.get("/user/calendar", HomeController.listcalendar);
router.get("/user/news", HomeController.listnews);
router.get("/user/book", HomeController.listbook);
router.get("/user/quiz",JwtAuth, HomeController.listquiz);

router.get("/user/schedule",JwtAuth, HomeController.listschedule);


router.get("/user/mylessons",JwtAuth, HomeController.mylessons);
router.get("/user/agenda",JwtAuth, HomeController.listagenda);
router.get("/user/agenda/:studentid",JwtAuth, HomeController.listagenda);
router.get("/user/attendance",JwtAuth, HomeController.listattendance);
router.get("/user/attendance/:studentid",JwtAuth, HomeController.listattendance);


router.get("/user/grades",JwtAuth, HomeController.listgrades);
router.get("/user/grades/:studentid",JwtAuth, HomeController.listgrades);
router.get("/user/exam",JwtAuth, HomeController.listexam);
router.get("/user/exam/:studentid",JwtAuth, HomeController.listexam);


router.get("/user/payment",JwtAuth, HomeController.listpayment);
router.get("/user/payment/:studentid",JwtAuth, HomeController.listpayment);

router.get("/user/health",JwtAuth, HomeController.listhealth);
router.get("/user/health/:studentid",JwtAuth, HomeController.listhealth);

router.get("/class/list",JwtAuth, HomeController.listclassx);


router.get("/mystudent/list",JwtAuth, HomeController.listmystudentbyclass);
router.get("/student/list/:classid",JwtAuth, HomeController.liststudentbyclass);
router.get("/matier/list/:classid",JwtAuth, HomeController.listmatierbyclass);
router.get("/teacher/list/:matier",JwtAuth, HomeController.listteacherbymatier);

router.get("/teacher/mymatier",JwtAuth, HomeController.listteachermymatier);


router.get("/rate/list/:studentid",JwtAuth, HomeController.liststudentrating);
router.get("/notification/list",JwtAuth, HomeController.listnotification);

router.post("/teacher/exam/save",JwtAuth, HomeController.teachersaveexam);
router.post("/teacher/lesson/save",JwtAuth, HomeController.teachersavelesson);
router.post("/teacher/agenda/save",JwtAuth, HomeController.teachersaveagenda);
router.post("/teacher/grade/save",JwtAuth, HomeController.teachersavegrades);

router.post("/teacher/student/rate",JwtAuth, HomeController.teacherratestudent);


router.post("/teacher/attendance/save",JwtAuth, HomeController.teachersaveattendacne);


router.get("/user/home", HomeController.listhome);

module.exports = router;




