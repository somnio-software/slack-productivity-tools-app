/* eslint-disable require-jsdoc */
/* eslint-disable indent */
const functions = require("firebase-functions");
const slackToken = require("./keys.json")["slack-token"]; //xoxp slack app token
const { WebClient } = require("@slack/web-api");

exports.setFocus = functions.https.onRequest(async (request, response) => {
	const web = new WebClient(slackToken);
	const text = request.body.text || "for 1 hour";
	const timeArr = text.split("for ");
	const time = timeArr.length > 1 ? timeArr[1] : "1 hour";
	functions.logger.info("Time: ", text);
	const res = await web.dnd.setSnooze({ num_minutes: time });
	functions.logger.info("Snoose set: ", res);

	// TODO: To be implemented: Don't create reminders, just a message from the app
	// const user = await web.users.identity({});
	// functions.logger.info("Hello USer!", user);

	// const postMessageRes = await web.chat.postMessage({
	//     text: "Focus off",
	// 	channel: user.id,
	// });

	const reminderRes = await web.reminders.add({
		text: "Focus off",
		time: time,
	});
	functions.logger.info("Reminder created: ", reminderRes);
	const profile = {
		status_text: `Focusing ${text}`,
		status_emoji: ":nerd_face:",
		status_expiration: res.snooze_endtime,
	};
	functions.logger.info("Profile updated: ", profile);
	await web.users.profile.set({ profile });
	response.send(
		`
        Result: Do not disturb and reminder ${time}. 
        `
	);
});
