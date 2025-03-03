'use strict';

var cacheCommon = require('@algolia/cache-common');
var cacheInMemory = require('@algolia/cache-in-memory');
var clientAnalytics = require('@algolia/client-analytics');
var clientCommon = require('@algolia/client-common');
var clientRecommendation = require('@algolia/client-recommendation');
var clientSearch = require('@algolia/client-search');
var loggerCommon = require('@algolia/logger-common');
var requesterNodeHttp = require('@algolia/requester-node-http');
var transporter = require('@algolia/transporter');

function algoliasearch(appId, apiKey, options) {
    const commonOptions = {
        appId,
        apiKey,
        timeouts: {
            connect: 2,
            read: 5,
            write: 30,
        },
        requester: requesterNodeHttp.createNodeHttpRequester(),
        logger: loggerCommon.createNullLogger(),
        responsesCache: cacheCommon.createNullCache(),
        requestsCache: cacheCommon.createNullCache(),
        hostsCache: cacheInMemory.createInMemoryCache(),
        userAgent: transporter.createUserAgent(clientCommon.version).add({
            segment: 'Node.js',
            version: process.versions.node,
        }),
    };
    return clientSearch.createSearchClient({
        ...commonOptions,
        ...options,
        methods: {
            search: clientSearch.multipleQueries,
            searchForFacetValues: clientSearch.multipleSearchForFacetValues,
            multipleBatch: clientSearch.multipleBatch,
            multipleGetObjects: clientSearch.multipleGetObjects,
            multipleQueries: clientSearch.multipleQueries,
            copyIndex: clientSearch.copyIndex,
            copySettings: clientSearch.copySettings,
            copyRules: clientSearch.copyRules,
            copySynonyms: clientSearch.copySynonyms,
            moveIndex: clientSearch.moveIndex,
            listIndices: clientSearch.listIndices,
            getLogs: clientSearch.getLogs,
            listClusters: clientSearch.listClusters,
            multipleSearchForFacetValues: clientSearch.multipleSearchForFacetValues,
            getApiKey: clientSearch.getApiKey,
            addApiKey: clientSearch.addApiKey,
            listApiKeys: clientSearch.listApiKeys,
            updateApiKey: clientSearch.updateApiKey,
            deleteApiKey: clientSearch.deleteApiKey,
            restoreApiKey: clientSearch.restoreApiKey,
            assignUserID: clientSearch.assignUserID,
            assignUserIDs: clientSearch.assignUserIDs,
            getUserID: clientSearch.getUserID,
            searchUserIDs: clientSearch.searchUserIDs,
            listUserIDs: clientSearch.listUserIDs,
            getTopUserIDs: clientSearch.getTopUserIDs,
            removeUserID: clientSearch.removeUserID,
            generateSecuredApiKey: clientSearch.generateSecuredApiKey,
            getSecuredApiKeyRemainingValidity: clientSearch.getSecuredApiKeyRemainingValidity,
            destroy: clientCommon.destroy,
            initIndex: base => (indexName) => {
                return clientSearch.initIndex(base)(indexName, {
                    methods: {
                        batch: clientSearch.batch,
                        delete: clientSearch.deleteIndex,
                        getObject: clientSearch.getObject,
                        getObjects: clientSearch.getObjects,
                        saveObject: clientSearch.saveObject,
                        saveObjects: clientSearch.saveObjects,
                        search: clientSearch.search,
                        searchForFacetValues: clientSearch.searchForFacetValues,
                        waitTask: clientSearch.waitTask,
                        setSettings: clientSearch.setSettings,
                        getSettings: clientSearch.getSettings,
                        partialUpdateObject: clientSearch.partialUpdateObject,
                        partialUpdateObjects: clientSearch.partialUpdateObjects,
                        deleteObject: clientSearch.deleteObject,
                        deleteObjects: clientSearch.deleteObjects,
                        deleteBy: clientSearch.deleteBy,
                        clearObjects: clientSearch.clearObjects,
                        browseObjects: clientSearch.browseObjects,
                        getObjectPosition: clientSearch.getObjectPosition,
                        findObject: clientSearch.findObject,
                        exists: clientSearch.exists,
                        saveSynonym: clientSearch.saveSynonym,
                        saveSynonyms: clientSearch.saveSynonyms,
                        getSynonym: clientSearch.getSynonym,
                        searchSynonyms: clientSearch.searchSynonyms,
                        browseSynonyms: clientSearch.browseSynonyms,
                        deleteSynonym: clientSearch.deleteSynonym,
                        clearSynonyms: clientSearch.clearSynonyms,
                        replaceAllObjects: clientSearch.replaceAllObjects,
                        replaceAllSynonyms: clientSearch.replaceAllSynonyms,
                        searchRules: clientSearch.searchRules,
                        getRule: clientSearch.getRule,
                        deleteRule: clientSearch.deleteRule,
                        saveRule: clientSearch.saveRule,
                        saveRules: clientSearch.saveRules,
                        replaceAllRules: clientSearch.replaceAllRules,
                        browseRules: clientSearch.browseRules,
                        clearRules: clientSearch.clearRules,
                    },
                });
            },
            initAnalytics: () => (clientOptions) => {
                return clientAnalytics.createAnalyticsClient({
                    ...commonOptions,
                    ...clientOptions,
                    methods: {
                        addABTest: clientAnalytics.addABTest,
                        getABTest: clientAnalytics.getABTest,
                        getABTests: clientAnalytics.getABTests,
                        stopABTest: clientAnalytics.stopABTest,
                        deleteABTest: clientAnalytics.deleteABTest,
                    },
                });
            },
            initRecommendation: () => (clientOptions) => {
                return clientRecommendation.createRecommendationClient({
                    ...commonOptions,
                    ...clientOptions,
                    methods: {
                        getPersonalizationStrategy: clientRecommendation.getPersonalizationStrategy,
                        setPersonalizationStrategy: clientRecommendation.setPersonalizationStrategy,
                    },
                });
            },
        },
    });
}
// eslint-disable-next-line functional/immutable-data
algoliasearch.version = clientCommon.version;

module.exports = algoliasearch;
