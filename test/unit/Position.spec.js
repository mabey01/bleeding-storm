/**
 * Created by Maximilian on 13.07.2015.
 */

describe('Position Factory', function () {

    var positionFactory;
    beforeEach(module('bleeding-storm'));
    beforeEach(inject(['bsMap.Position', function (_positionFactory) {
        positionFactory = _positionFactory;
    }]));

    describe('Construction', function () {

        it('should exist', function () {
            expect(positionFactory).toBeDefined();
        });

        it('should not be null', function () {
            expect(positionFactory).not.toBeNull();
        });

        it('should have an construct method', function () {
            expect(positionFactory.construct).toBeDefined();
        });
    });

    describe('Functionality', function() {
        it('should create a position without parameters', function() {
            let position = positionFactory.construct();
            expect(position.getX()).toEqual(0);
            expect(position.getY()).toEqual(0);
        });

        it('should create a position with x and y provided', function() {
            let position = positionFactory.construct({x: 1, y:3});
            expect(position.getX()).toEqual(1);
            expect(position.getY()).toEqual(3);
        });

        it('should move position by a specific amout', function() {
            let position = positionFactory.construct({x: 1, y:3});
            let newPosition = position.moveBy(3,1);
            expect(newPosition.getX()).toEqual(4);
            expect(newPosition.getY()).toEqual(4);

            let newPosition = newPosition.moveBy(newPosition);
            expect(newPosition.getX()).toEqual(8);
            expect(newPosition.getY()).toEqual(8);
        });

        it('should compare 2 positions', function() {
            let positionA = positionFactory.construct({x: 1, y:3});
            let positionB = positionFactory.construct({x: 6, y:2});

            expect(positionA.equals(positionB)).toBeFalsy();
            expect(positionA.equals(positionA)).toBeTruthy();
        });

        it('should serialize a position', function() {
            let position = positionFactory.construct({x: 1, y:3});
            let serialized = position.serialize();
            expect(serialized.x).toEqual(1);
            expect(serialized.y).toEqual(3);
        });

        it('should set a new position', function() {
            let position = positionFactory.construct({x: 1, y:3});
            position.setPosition(2,1);
            expect(position.getX()).toEqual(2);
            expect(position.getY()).toEqual(1);

            let newPosition = positionFactory.construct({x: 5, y:4});
            position.setPosition(newPosition);
            expect(position.getX()).toEqual(5);
            expect(position.getY()).toEqual(4);

            position.setPosition({x: 4, y: 7});
            expect(position.getX()).toEqual(4);
            expect(position.getY()).toEqual(7);
        });
    })
});