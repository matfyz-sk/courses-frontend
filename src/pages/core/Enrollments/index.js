
export async function Enroll(user, course, firebase) {
    let enrolled = await isEnrolledIn(user, course, firebase)
    if (!enrolled) {
        firebase.enrollments()
            .add({
                user: user,
                courseInstance: course
            })
    }
}

export async function isEnrolledIn(userId, courseId, firebase) {
    return await firebase.enrollments().where("user", "==", userId)
    .get()
    .then(snapshot => {
        let ret = false;
        snapshot.forEach(enrollment => {
            if (enrollment.data().courseInstance === courseId) {
                ret = true;
            }
        });
        return ret;
    });
}

