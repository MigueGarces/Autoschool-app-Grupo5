from rest_framework import serializers
from .models import Student, Instructor, Vehicle, Course, Enrollment, Lesson

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class InstructorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instructor
        fields = '__all__'

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

    def validate_duration_hours(self, value):
        if value <= 0:
            raise serializers.ValidationError("Debe durar mas de 0 horas >:( ).")
        return value

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Precio debe ser mayor a 0 <3.")
        return value

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Debe tener nombre jaja.")
        return value

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'
