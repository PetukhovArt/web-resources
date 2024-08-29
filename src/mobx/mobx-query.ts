import {
    DefaultError,
    QueryClient,
    QueryKey,
    QueryObserver,
    QueryObserverOptions
} from '@tanstack/query-core'
import { computed, createAtom, makeObservable, reaction } from 'mobx'

//app instance
const queryClient = new QueryClient()

export class MobxQuery<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
> {
    private atom = createAtom(
        'MobxQuery',
        () => this.startTracking(),
        () => this.stopTracking()
    )

    private queryObserver: QueryObserver<TQueryFnData, TError, TData, TQueryData, TQueryKey>

    constructor(
        private getOptions: () => QueryObserverOptions<
            TQueryFnData,
            TError,
            TData,
            TQueryData,
            TQueryKey
        >,
        private queryClinet: QueryClient = queryClient
    ) {
        makeObservable(this, {
            data: computed
        })

        this.queryObserver = new QueryObserver(this.queryClinet, this.defaultQueryOptions)
    }

    fetch() {
        return this.queryClinet.fetchQuery(this.defaultQueryOptions)
    }

    get result() {
        this.atom.reportObserved()
        return this.queryObserver.getOptimisticResult(this.defaultQueryOptions)
    }

    get data(): TData {
        const data = this.result.data

        if (!data) {
            throw this.queryObserver.fetchOptimistic(this.defaultQueryOptions)
        }

        return data
    }

    private unsubscribe = () => {}
    private startTracking() {
        const unsubscribeReaction = reaction(
            () => this.defaultQueryOptions,
            () => this.queryObserver.setOptions(this.defaultQueryOptions)
        )

        const unsubscribeObserver = this.queryObserver.subscribe(() => {
            this.atom.reportChanged()
        })

        this.unsubscribe = () => {
            unsubscribeReaction()
            unsubscribeObserver()
        }
    }

    private stopTracking() {
        this.unsubscribe()
    }

    private get defaultQueryOptions() {
        return this.queryClinet.defaultQueryOptions(this.getOptions())
    }
}
