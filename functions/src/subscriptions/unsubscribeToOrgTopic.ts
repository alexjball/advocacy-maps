import { Database } from "../types";
import { UserRecord } from "firebase-admin/auth";
import { TopicSubscription } from "./types";
import { removeTopicSubscription } from "./removeTopicSubscription";

export const unsubscribeToOrgTopic = async ({
    user,
    orgLookup,
    db,
}: {
    user: UserRecord;
    orgLookup: {profileId: string, fullName: string};
    db: Database;
}) => {
    const uid = user.uid;
    const topicName = `org-${orgLookup.profileId.toString()}`;
  
    const subscriptionData: TopicSubscription = {
        topicName,
        uid,
        type: "org",
        orgLookup,
    };
  
    await removeTopicSubscription({ user, subscriptionData, db });
};  