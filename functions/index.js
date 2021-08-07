/* eslint-disable require-jsdoc */
/* eslint-disable indent */
const functions = require("firebase-functions");
const { WebClient } = require("@slack/web-api");

const token =
	"xoxp-854267239954-869257735894-2339908881860-4e92b8659933cf82df0223e5c781e2b7";

// // https://firebase.google.com/docs/functions/write-firebase-functions
exports.setFocus = functions.https.onRequest(async (request, response) => {
	const web = new WebClient(token);
	const text = request.body.text || "for 1 hour";
	const timeArr = text.split("for ");
	const time = timeArr.length > 1 ? timeArr[1] : "1 hour";
	functions.logger.info("Hello focus!", { structuredData: true, request });
	functions.logger.info("Hello text!", text);
	const res = await web.dnd.setSnooze({ num_minutes: time });
	functions.logger.info("Hello Result!", res);

	// const user = await web.users.identity({});
	// functions.logger.info("Hello USer!", user);

	// const postMessageRes = await web.chat.postMessage({
	//     text: "Focus off",
	// 	channel: user.id,
	// });
	const res2 = await web.reminders.add({
		text: "Focus off",
		time: time,
	});
	const profile = {
		status_text: `Focusing ${text}`,
		status_emoji: ":nerd_face:",
		status_expiration: res.snooze_endtime,
	};
	functions.logger.info("Hello profile!", profile);
	await web.users.profile.set({ profile });
	response.send(
		`
        Result: Do not disturb and reminder ${time}. 
        `
	);
});
