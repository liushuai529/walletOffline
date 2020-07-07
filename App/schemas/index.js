import { findUser, findAuditmanage } from './user'
import {
  findDelegateSelfCurrent,
  findDelegateSelfHistory,
} from './delegate'
import {
  findPaymentListRecharge,
  findPaymentListWithdraw,
  findPaymentListPlatformTransfer,
} from './payment'
import findListSelf from './deal'
import * as home from './home'
import findAssetList from './asset'
import findAddress from './address'
import { findOtcList } from './otcDetail'
import findOpenOrders from './exchange'
import {findInvitation,findRebatestat} from './rebates'

const schemas = {
  findUser,
  findAuditmanage,
  findPaymentListRecharge,
  findPaymentListWithdraw,
  findPaymentListPlatformTransfer,
  findDelegateSelfCurrent,
  findDelegateSelfHistory,
  findListSelf,
  findAssetList,
  findBanners: home.findBanners,
  findAnnouncement: home.findAnnouncement,
  findAddress,
  findOtcList,
  findOpenOrders,
  findInvitation,
  findRebatestat,
}
export default schemas
