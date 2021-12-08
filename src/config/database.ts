const DATABASE_NAME = "@gofinances";

const COLLECTION_TRANSACTIONS = (userId: string) =>
  `${DATABASE_NAME}:transactions_user:${userId}`;

const COLLECTION_USER = `${DATABASE_NAME}:user`;

export const storage = {
  transactionsKey: COLLECTION_TRANSACTIONS,
  userKey: COLLECTION_USER,
};
