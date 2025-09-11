from django.http import HttpResponse, JsonResponse


def metrics(request):
    data = [
        { "title": "Presion", "value": 43.0, "measure": "Bar", "maxValue": 65 },
        { "title": "Velocidad", "value": 0.1, "measure": "m/s", "maxValue": 0.5 },
        { "title": "Temperatura", "value": 70, "measure": "°C", "maxValue": 130 },
        { "title": "Torque", "value": 20, "measure": "RPM", "maxValue": 50 },
    ]
    return JsonResponse(data, safe=False)

def 
