'use client'

import { lazy } from 'react'
import { IconFileExport } from '@tabler/icons-react'

import { modals } from '@mantine/modals'
import { ActionIcon, useComputedColorScheme } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import { useGlobal } from 'state/global'

const ExportSubcriptionsModal = lazy(() => import('./exportSubcriptionsModal'))

const ExportSubscriptionsButton = () => {
	const { user } = useGlobal()

	const scheme = useComputedColorScheme()

	const onExport = () => {
		if (user.plan === 'FREE') {
			notifications.show({
				color: 'red.5',
				title: 'Not available in current plan',
				message: `Exporting subscriptions are not available in free plan, please upgrade to paid plan to export subscriptions data.`,
			})
			return
		}
		modals.open({
			title: 'Export Subscriptions',
			children: <ExportSubcriptionsModal />,
		})
	}
	return (
		<ActionIcon
			variant="subtle"
			onClick={onExport}
			title="Export Subscriptions"
			color={scheme === 'light' ? 'dark' : 'gray'}
		>
			<IconFileExport size={18} />
		</ActionIcon>
	)
}

export default ExportSubscriptionsButton
