/**
 * Created by Maximilian on 13.05.2015.
 */

describe('Session Factory', function () {

    var sessionFactory;
    beforeEach(module('bleeding-storm'));
    beforeEach(inject(['bsSession.SessionFactory', function (_sessionFactory) {
        sessionFactory = _sessionFactory;
    }]));

    const rawSessionObject = {
        _id : '12345',
        topic : 'testing',
        description : 'its about testing',
        startingTime : new Date(2014, 11, 24, 16, 0, 25, 0),
        endTime : new Date(2014, 11, 24, 17, 0, 25, 0),
        map : {
            id: 123,
            position : {x:0,y:0}
        }
    };

    describe('Construction', function () {

        it('should exist', function () {
            expect(sessionFactory).toBeDefined();
        });

        it('should not be null', function () {
            expect(sessionFactory).not.toBeNull();
        });

        it('should have an construct method', function () {
            expect(sessionFactory.construct).toBeDefined();
        });
    });

    describe('Session object', function () {

        let testingSession = null;
        beforeEach(function () {
            testingSession = sessionFactory.construct(rawSessionObject);
        });

        it('should construct an session object', function () {
            expect(testingSession).toBeDefined();
            expect(testingSession).not.toBeNull();

            expect(testingSession.getID).toBeDefined();
            expect(testingSession.getTopic).toBeDefined();
            expect(testingSession.getDescription).toBeDefined();
            expect(testingSession.getStartingTime).toBeDefined();
            expect(testingSession.getEndTime).toBeDefined();
            expect(testingSession.isActive).toBeDefined();
        });

        it('should return all the right getter values', function () {
            expect(testingSession.getID()).toEqual(rawSessionObject._id);
            //expect(testingSession.getTopic()).toEqual(rawSessionObject.topic);
            //expect(testingSession.getDescription()).toEqual(rawSessionObject.description);
        });

        it('should not be active', function () {
            expect(testingSession.isActive()).toBeFalsy();
        });
    })
});