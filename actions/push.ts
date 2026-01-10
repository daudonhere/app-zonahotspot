"use server";
import webPush from "web-push";
webPush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);
const subscriptions: PushSubscription[] = [];
export async function subscribePush(
  subscription: PushSubscription
) {
  const exists = subscriptions.find(
    (s) => s.endpoint === subscription.endpoint
  );
  if (!exists) {
    subscriptions.push(subscription);
  }
  return { success: true };
}
export async function sendPushNotification(
  title: string,
  body: string
) {
  const payload = JSON.stringify({
    title,
    body,
  });
  await Promise.all(
    subscriptions.map((sub) =>
      webPush.sendNotification(sub, payload).catch(() => null)
    )
  );
  return { success: true };
}
