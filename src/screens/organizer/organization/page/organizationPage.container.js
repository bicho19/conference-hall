import { compose } from 'redux'
import { inject } from '@k-ramel/react'
import forRoute from 'hoc-little-router'

import loader from 'components/loader'

import OrganizationPage from './organizationPage'

const mapStore = (store, _, { router }) => {
  const organizationId = router.getRouteParam('organizationId')
  const organization = store.data.organizations.get(organizationId)

  const { uid: userId } = store.auth.get()
  const url = window.location.href.split('/')

  return {
    loaded: store.data.organizations.hasKey(organizationId),
    ...organization,
    authUserId: userId,
    inviteLink: `${url[0]}//${url[2]}/organizer/invite/organization/${organizationId}/${userId}`,
    load: () => store.dispatch('@@ui/ON_LOAD_ORGANIZATION'),
    onSelectUser: (uid) => {
      store.dispatch({ type: '@@ui/ADD_ORGANIZATION_MEMBER', payload: { uid, organizationId } })
      store.ui.modal.set({ openedModal: undefined })
    },
    removeMember: uid => store.dispatch({ type: '@@ui/REMOVE_ORGANIZATION_MEMBER', payload: { uid, organizationId } }),
  }
}

export default compose(
  forRoute.absolute('ORGANIZATION_PAGE'),
  inject(mapStore),
  loader,
)(OrganizationPage)
