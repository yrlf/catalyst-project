from django.http import HttpResponse
from django.views.decorators.http import require_http_methods
import hashlib
import json 
def response(code: int, message:str, data: any=None):
    body = {'code': code, 'message': message, 'data':{}}
    if data is not None:
        if hasattr(data,'__dict__'):
            body['data'] = data.__dict__
        else:
            body['data'] = data
    return HttpResponse(json.dumps(body, sort_keys=True, ensure_ascii=False))

list_data =[
    # add new: formulaPretty: "CS2", elements: "C, S", bandGap: 3.43, structure: "Orthorhombic"
    {"id":"1", "formulaPretty":"MoS2","elements": "Mo, S", "bandGap": 3.43, "structure": "Orthorhombic", "description":"Molybdenum Disulfide", "poscar":[]},
    {"id":"2", "formulaPretty":"CNT","elements": "C", "bandGap": -3.43, "structure": "Orthorhombic", "description":"Molybdenum Disulfide", "poscar":[]},
    {"id":"3", "formulaPretty":"MnO2","elements": "Mn, O", "bandGap": 2.43, "structure": "Orthorhombic", "description":"Molybdenum Disulfide", "poscar":[]},

    # {"id":"123", "name":"CNT-50", "description":"50% Carbon Nanotube", "poscar":[]},
    # {"id":"124", "name":"CNT-60", "description":"60% Carbon Nanotube", "poscar":[]},
    # {"id":"125", "name":"CNT-70", "description":"70% Carbon Nanotube", "poscar":[]},
]

def upload(request):
    print(request.body)
    param = json.loads(request.body)
    if str(request.body) == "":
        return response(404, "No data provided")
    

    data = {
        "id":param['id'], 
        "name":param['name'],
        "prettyFormula":param['prettyFormula'],
        "elements":param['elements'],
        "bandGap":param['bandGap'],
        "structure":param['structure'],
        "description":param['description'],
        "poscar":param['poscar']
    }
    
    list_data.append(data)

    return response(0, "ok", {"id":param['id']})

def list(request):
    return response(0, "ok", list_data)

def findDataById(list, id):
    for i in range(len(list)):
        if list[i]['id'] == id:
            return list[i]
    return None


def detail(request):
    id = request.GET.get("id", "")
    if id == "":
        return response(404, "ID not provided")
    data = findDataById(list_data, id)
    if data is None:
        return response(404, "Data not found")
    return response(0, "ok", data)

poscar_files = []

import time
poscar = {}


@require_http_methods("POST") # 必须写这个才能用request.FILES
def uploadPOSCAR(request):
    f = request.FILES['file']
    filename = "{}{}".format(f.name, time.time())
    # 加密文件名作为 id
    poscar['filename'] = hashlib.md5(filename.encode('utf-8')).hexdigest()
    poscar['data'] = f.read() # 具体文件内容
    poscar_files.append(poscar)
    print(poscar['filename'], poscar['data'])
    return response(0, "ok", {"id":poscar['filename']})
