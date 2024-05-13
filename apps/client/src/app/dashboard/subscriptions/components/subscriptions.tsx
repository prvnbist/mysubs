'use client'

import { lazy, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { Button, Card, Group, SegmentedControl, SimpleGrid, Skeleton } from '@mantine/core'

import { ISubscription } from 'types'
import { CYCLES } from 'constants/index'
import { subscriptions_list } from 'actions'
import { CreateEmptyState, ErrorState } from 'components'

const CreateModal = lazy(() => import('./createModal'))
const Subscription = lazy(() => import('./subscription'))

const Subscriptions = () => {
	const router = useRouter()

	const [interval, setInterval] = useState('ALL')

	const { status, data, error } = useQuery({
		retry: 0,
		refetchOnWindowFocus: false,
		queryKey: ['subscriptions', interval],
		queryFn: () => subscriptions_list(interval),
	})

	useEffect(() => {
		if ((status === 'error' && error) || data?.status === 'ERROR') {
			notifications.show({
				color: 'red',
				title: 'Failed',
				message: data?.message,
			})
		}
	}, [status, data, error])

	const create = () => {
		modals.open({
			title: 'Create Subscription',
			children: <CreateModal />,
		})
	}

	const edit = (data: ISubscription) => {
		modals.open({
			title: 'Edit Subscription',
			children: <CreateModal subscription={data} />,
		})
	}

	return (
		<>
			<Group mb={16}>
				<SegmentedControl
					size="sm"
					radius="sm"
					value={interval}
					onChange={setInterval}
					withItemsBorders={false}
					data={[{ value: 'ALL', label: 'All' }, ...CYCLES]}
				/>
			</Group>
			{status === 'pending' && <LoadingSkeleton />}
			{status === 'error' && (
				<ErrorState title="Something went wrong!">
					<Button title="Refresh Page" onClick={() => router.refresh()}>
						Refresh Page
					</Button>
				</ErrorState>
			)}
			{status === 'success' && Array.isArray(data.data) && (
				<>
					{data.data.length ? (
						<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
							{data.data.map(subscription => (
								<Subscription
									onEdit={edit}
									key={subscription.id}
									subscription={subscription}
								/>
							))}
						</SimpleGrid>
					) : (
						<CreateEmptyState
							title="Create a subscription"
							description="You don't have any subscriptions yet, let's start by creating one!"
						>
							<Button title="Create Subscription" onClick={create}>
								Create Subscription
							</Button>
						</CreateEmptyState>
					)}
				</>
			)}
		</>
	)
}

export default Subscriptions

const LoadingSkeleton = () => {
	return (
		<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
			<Card h={88} shadow="sm" padding="lg" radius="md" withBorder>
				<Skeleton height={62} w="70%" circle />
				<Skeleton height={62} w="30%" circle my={8} />
				<Skeleton height={62} w="50%" circle />
			</Card>
			<Card h={88} shadow="sm" padding="lg" radius="md" withBorder>
				<Skeleton height={62} w="40%" circle />
				<Skeleton height={62} w="70%" circle my={8} />
				<Skeleton height={62} w="30%" circle />
			</Card>
			<Card h={88} shadow="sm" padding="lg" radius="md" withBorder>
				<Skeleton height={62} w="90%" circle />
				<Skeleton height={62} w="60%" circle my={8} />
				<Skeleton height={62} w="40%" circle />
			</Card>
			<Card h={88} shadow="sm" padding="lg" radius="md" withBorder>
				<Skeleton height={62} w="50%" circle />
				<Skeleton height={62} w="80%" circle my={8} />
				<Skeleton height={62} w="40%" circle />
			</Card>
			<Card h={88} shadow="sm" padding="lg" radius="md" withBorder>
				<Skeleton height={62} w="70%" circle />
				<Skeleton height={62} w="40%" circle my={8} />
				<Skeleton height={62} w="60%" circle />
			</Card>
		</SimpleGrid>
	)
}
