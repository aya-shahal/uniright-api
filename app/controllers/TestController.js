
module.exports = {

    /**
     * Show homepage
     * @param req
     * @param res
     * @param next
     */
    index: async function (req, res, next) {


       // Notification.addNotificationStudent("639c1623cb5ea441737c85fc","fefef")

        let token = "ew13_8rCS-u-rY_UoJc6_r:APA91bFhVQkdkLADCkJD9ftT2CzlfsGujyv9YcCzIuCxMEHf6yrJs3nKfwN8wfpR1kEUGxtj6pmH9ZXuNQZAxMHMqQfDHjzAEKZi3a3Yo5KOFW2hIwGeoUQcAL5M81uyH8_jg6mHRNUm"
        ;

        //PushNotification.globalsend(token,"Right Track School Solution","Testing 123")

        return res.render("hello");

    },


    clearall: async function (req, res, next) {

       // Matier.deleteMany().exec();
        //return res.render("hello");
        Agenda.deleteMany().exec();
        Attendance.deleteMany().exec();
       // Calendar.deleteMany().exec();
        Exam.deleteMany().exec();
        Classx.deleteMany().exec();
        Grade.deleteMany().exec();
        Matier.deleteMany().exec();
        Parent.deleteMany().exec();
        Student.deleteMany().exec();
        Teacher.deleteMany().exec();
        TeacherMatier.deleteMany().exec();
        return res.render("hello");
    },
    createmanager: async function (req, res, next) {

       // return res.render("hello")
        await ManagerType.deleteMany().exec();
        const adminid = await ManagerType.AddManager("admin");





       // const adminid = await ManagerType.findOne({name:"admin"}).exec();

        let admininfo = await Manager.findOne({username:"admin"}).exec();
if(admininfo){
    admininfo.password= "letmein";
    await admininfo.save()
    return res.render("hello");
}

console.log("adminid",adminid)
        let newdata = new Manager();
        newdata.full_name ="admin";
        newdata.username = "admin";
        newdata.password = "letmein";
       newdata.managertype = adminid;
        await newdata.save()

        return res.render("hello");
    },


    parsefile: async function (req, res, next) {

       //await FileParser.parse("category.csv")
        return res.render("hello");
    },





};
