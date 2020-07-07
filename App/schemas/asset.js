export default function findAssetList(userId) {
  return {
    user_id: userId,
    token_ids: ['*']
  };
}
