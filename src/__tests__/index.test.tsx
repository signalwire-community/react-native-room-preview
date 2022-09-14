import React from 'react';
import { render } from '@testing-library/react-native';
import fetchMock from 'fetch-mock'
import RoomPreview from '../components/RoomPreview'

describe('Makes the appropriate network requests', () => {

    describe("", () => {
        beforeEach(() => {
            fetchMock
                .mock('http://example.com/loading', 200)
                .mock('http://example.com/preview', 200)
        });

        afterEach(() => {
            fetchMock.restore();
        });

        it('Fetches preview on first render if the preview is ready', () => {
            render(<RoomPreview loadingUrl={{ uri: 'http://example.com/loading' }} previewUrl={{ uri: 'http://example.com/preview' }} />)

            expect(fetchMock.called('http://example.com/loading', { method: 'HEAD' })).toBe(true)
            expect(fetchMock.called('http://example.com/preview', { method: 'HEAD' })).toBe(true)
        })
    })
    
})