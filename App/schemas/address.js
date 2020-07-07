export default function findAddress(id) {
  return `{
    find_address(
        skip: 0,
        limit: 10,
        where:{
          user_id: ${id}
        }
        order: "-createdAt"
    ){
        id,
        withdrawaddr,
        remark
        token{
          id
          name
        }
        createdAt
    }
  }`
}
