import * as test from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { beforeAll, afterAll, afterEach, describe, it } from 'vitest';

const PROJECT_ID = 'freetv-8af4a';
let testEnv: test.RulesTestEnvironment;

beforeAll(async () => {
    testEnv = await test.initializeTestEnvironment({
        projectId: PROJECT_ID,
        firestore: {
            rules: readFileSync('DRAFT_firestore.rules', 'utf8'),
        },
    });
});

afterAll(async () => {
    await testEnv.cleanup();
});

afterEach(async () => {
    await testEnv.clearFirestore();
});

describe('Firestore security rules', () => {
    it('Require auth to read user config', async () => {
        const unauthenticatedContext = testEnv.unauthenticatedContext();
        await test.assertFails(unauthenticatedContext.firestore().collection('userConfigs').doc('user123').get());
    });

    it('Allow user to read their own config', async () => {
        const authenticatedContext = testEnv.authenticatedContext('user123');
        await test.assertSucceeds(authenticatedContext.firestore().collection('userConfigs').doc('user123').get());
    });

    it('Deny user from reading other user config', async () => {
        const authenticatedContext = testEnv.authenticatedContext('user123');
        await test.assertFails(authenticatedContext.firestore().collection('userConfigs').doc('user456').get());
    });

    it('Allow user to write their own config with required fields', async () => {
        const authenticatedContext = testEnv.authenticatedContext('user123');
        await test.assertSucceeds(authenticatedContext.firestore().collection('userConfigs').doc('user123').set({
            userId: 'user123',
            configType: 'm3u',
            url: 'https://example.com/playlist.m3u',
            updatedAt: (authenticatedContext.firestore().collection('fake').firestore as any).FieldValue.serverTimestamp() || 123
        }));
    });

    it('Deny user from writing their own config with invalid schema', async () => {
        const authenticatedContext = testEnv.authenticatedContext('user123');
        await test.assertFails(authenticatedContext.firestore().collection('userConfigs').doc('user123').set({
            userId: 'user123',
            // missing configType
            url: 'https://example.com/playlist.m3u',
            updatedAt: 123
        }));
    });
});
