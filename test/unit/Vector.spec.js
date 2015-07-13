/**
 * Created by Maximilian on 02.07.2015.
 */

describe('Vector Factory', function () {

    var vectorFactory;
    beforeEach(module('bleeding-storm'));
    beforeEach(inject(['bsMap.Vector', function (_vectorFactory) {
        vectorFactory = _vectorFactory;
    }]));

    describe('Construction', function () {

        it('should exist', function () {
            expect(vectorFactory).toBeDefined();
        });

        it('should not be null', function () {
            expect(vectorFactory).not.toBeNull();
        });

        it('should have an construct method', function () {
            expect(vectorFactory.construct).toBeDefined();
        });
    });

    describe('Functionality', function() {
        it('should normalize Vector correctly', function() {
           let vector = vectorFactory.construct(2,3);
            expect(vector.getNormalizedVector().getLength()).toEqual(1);
        });

        it('should add Vectors correctly', function() {
            let a = vectorFactory.construct(1,2,3);
            let b = vectorFactory.construct(2,3,4);

            a.add(b);

            expect(a.getX()).toEqual(3);
            expect(a.getY()).toEqual(5);
            expect(a.getZ()).toEqual(7);
        });

        it('should stech Vector correctly', function() {
            let a = vectorFactory.construct(1,2,3);
            let originalLength = a.getLength();
            a.stretch(2);
            expect(a.getLength()).toEqual(originalLength*2);
        });

        it('should rotate Vector correctly', function() {
            let a = vectorFactory.construct(2,1);
            let oldX = a.getX();
            let oldY = a.getY();

            a.rotate(180);

            expect(Math.round(a.getX())).toEqual((-1) * oldX);
            expect(Math.round(a.getY())).toEqual((-1) * oldY);
        });
    })
});