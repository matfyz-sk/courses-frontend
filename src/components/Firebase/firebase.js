import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'

// const config = {
//     apiKey: process.env.REACT_APP_API_KEY,
//     authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//     databaseURL: process.env.REACT_APP_DATABASE_URL,
//     projectId: process.env.REACT_APP_PROJECT_ID,
//     storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//     messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
// };

var config = {
    apiKey: "AIzaSyDwffSNaC5vTw_Y_NermgfhCNR6GMGbmXA",
    authDomain: "courses-11b2c.firebaseapp.com",
    databaseURL: "https://courses-11b2c.firebaseio.com",
    projectId: "courses-11b2c",
    storageBucket: "courses-11b2c.appspot.com",
    messagingSenderId: "45212982579"
};

class Firebase {
    constructor() {
        app.initializeApp(config);

        this.auth = app.auth();
        this.db = app.firestore();
    }

    // *** Auth API ***

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);

    // *** Merge Auth and DB User API *** //

    onAuthUserListener = (next, fallback) =>
        this.auth.onAuthStateChanged(authUser => {
            if (authUser) {
                this.user(authUser.uid)
                    .get()
                    .then(snapshot => {
                        const dbUser = snapshot.data();

                        // default empty roles
                        if (!dbUser.roles) {
                            dbUser.roles = [];
                        }

                        // merge auth and db user
                        authUser = {
                            uid: authUser.uid,
                            email: authUser.email,
                            ...dbUser,
                        };

                        next(authUser);
                    });
            } else {
                fallback();
            }
        });

    // *** User API ***

    user = uid => this.db.doc(`users/${uid}`);

    users = () => this.db.collection('users');

    // *** Course API ***

    course = cid => this.db.doc(`courses/${cid}`);

    courses = () => this.db.collection('courses');

    // *** CourseInstance API ***

    courseInstance = cid => this.db.doc(`courseInstances/${cid}`);

    courseInstances = () => this.db.collection('courseInstances');

    // *** Enrollments API ***

    enrollment = eid => this.db.doc(`user_courseInstance/${eid}`);

    enrollments = () => this.db.collection('user_courseInstance');

    // *** Event API ***

    courseEvent = eid => this.db.doc(`events/${eid}`);

    courseEvents = () => this.db.collection('events');

}


export default Firebase;