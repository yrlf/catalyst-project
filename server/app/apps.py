from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_http_methods
import hashlib
import json 
from . import pymongo
import time
from bson import binary


# def response(code: int, message:str, data: any=None):
#     body = {'code': code, 'message': message, 'data':{}}
#     if data is not None:
#         if hasattr(data,'__dict__'):
#             body['data'] = data.__dict__
#         else:
#             body['data'] = data
#     return HttpResponse(json.dumps(body, sort_keys=True, ensure_ascii=False))


from bson import ObjectId

def response(code: int, message: str, data: any = None):
    body = {'code': code, 'message': message, 'data': {}}
    if data is not None:
        if isinstance(data, dict):
            # 将所有 ObjectId 实例转换为字符串
            for key, value in data.items():
                if isinstance(value, ObjectId):
                    data[key] = str(value)
        body['data'] = data
    return HttpResponse(json.dumps(body, sort_keys=True, ensure_ascii=False))

db = pymongo.MongoDB

# @require_http_methods(["GET"])
# def list(request):
#     materials = []
#     data = pymongo.MongoDB.materials.find()
#     for d in data:
#         material = {key: str(value) if key == '_id' else value for key, value in d.items()}
#         materials.append(material)
#     return JsonResponse({"status": 0, "message": "ok", "data": materials})

@require_http_methods(["GET"])
def list(request):
    materials = []
    data = db.materials.find()  # Fetch data from MongoDB
    for d in data:
        # Extract only the needed fields and include both _id and material_id
        material = {
            '_id': str(d['_id']),  # Convert ObjectId to string for JSON serialization
            'material_id': d.get('material_id', 'N/A'),  # Treat material_id as a normal feature
            'formula_pretty': d.get('formula_pretty', 'N/A'),  # Use get to avoid KeyError if the field is missing
            'band_gap': d.get('band_gap', 'N/A'),  # Provide default values if key does not exist
            'energy_above_hull': d.get('energy_above_hull', 'N/A')
        }
        materials.append(material)
    return JsonResponse({"status": 0, "message": "ok", "data": materials})

# @require_http_methods(["GET"])
# def list(request):
#     materials = []
#     data = pymongo.MongoDB.materials.find()
#     for d in data:
#         materials.append({
#             "id": str(d['_id']),  # 确保 ID 是字符串格式
#             "prettyFormula": d['prettyFormula'],
#             "elements": d['elements'],
#             "bandGap": d['bandGap'],
#             "structure": d['structure'],
#             "description": d['description'],
#             "poscar": d['poscar']
#         })
#     return response(0, "ok", materials)

def findDataById(list, id):
    for i in range(len(list)):
        if list[i]['id'] == id:
            return list[i]
    return None

# def detail(request):
#     id = request.GET.get("id", "")
#     if id == "":
#         return response(404, "ID not provided")
#     data = pymongo.MongoDB.materials.find_one({"_id": ObjectId(id)})
#     if data is None:
#         return response(404, "Data not found")
#     return response(0, "ok", data)


def detail(request):
    id = request.GET.get("id", "")
    print("Requested material_id:", id)
    if id == "":
        return JsonResponse({'status': 404, 'message': 'Material ID not provided'}, status=404)

    # Query using 'material_id' instead of MongoDB '_id'
    material = db.materials.find_one({"material_id": id})
    if material is None:
        return JsonResponse({'status': 404, 'message': 'Material not found'}, status=404)

    poscar_id = material.get("poscar")
    poscar_content = ""
    if poscar_id:
        # Assume poscar_id is also a string and not an ObjectId
        poscar_file = db.poscar.find_one({"_id": ObjectId(poscar_id)})
        if poscar_file:
            poscar_content = poscar_file.get('body', '').decode('utf-8')  # Ensure content is correctly decoded to string

    material_data = {
        "prettyFormula": material.get('formula_pretty', 'N/A'),
        "elements": material.get('elements', 'N/A'),
        "bandGap": material.get('band_gap', 'N/A'),
        "structure": material.get('structure', 'N/A'),
        "description": material.get('description', 'N/A'),
        "poscarContent": poscar_content  # Include POSCAR content in the returned data
    }

    return JsonResponse({'status': 0, 'message': 'ok', 'data': material_data})

# def detail(request):
#     id = request.GET.get("id", "")
#     if id == "":
#         return response(404, "ID not provided")

#     material = pymongo.MongoDB.materials.find_one({"_id": ObjectId(id)})
#     if material is None:
#         return response(404, "Material not found")

#     poscar_id = material.get("poscar")
#     poscar_content = ""
#     if poscar_id:
#         poscar_file = pymongo.MongoDB.poscar.find_one({"_id": ObjectId(poscar_id)})
#         if poscar_file:
#             poscar_content = poscar_file.get('body', '').decode('utf-8')  # 确保内容被正确解码为字符串

#     material_data = {
#         "prettyFormula": material['prettyFormula'],
#         "elements": material['elements'],
#         "bandGap": material['bandGap'],
#         "structure": material['structure'],
#         "description": material['description'],
#         "poscarContent": poscar_content  # 添加POSCAR内容到返回的数据中
#     }
    
#     return response(0, "ok", material_data)


# def detail(request):
#     id = request.GET.get("id", "")
#     if id == "":
#         return response(404, "ID not provided")
#     data = findDataById(list_data, id)
#     if data is None:
#         return response(404, "Data not found")
#     return response(0, "ok", data)

poscar_files = []

poscar = {}


# id, md5, type, body: file

# @require_http_methods("POST") # 必须写这个才能用request.FILES
# def uploadPOSCAR(request):
    
#     f = request.FILES['file']

#     body = f.read() # 具体文件内容
#     md5 = hashlib.md5(body).hexdigest()
#     typ = f.content_type

#     data = {
#         "md5": md5,
#         "type": typ,
#         "body": body
#         # 如果是图片, 可以转为二进制存储:binary.Binary(body)
#     }

#     # 查找文件是否已经存在
#     file = pymongo.MongoDB.poscar.find_one({"md5":md5})
#     if file is not None:
#         print("already exists", file['md5'])
#         return response(0, "ok", {"id":file['md5']})
        
#     # 插入一条新的数据
#     pymongo.MongoDB.poscar.insert_one({data})


#     filename = "{}{}".format(f.name, time.time())
#     # 加密文件名作为 id
#     poscar['filename'] = hashlib.md5(filename.encode('utf-8')).hexdigest()
#     poscar['data'] = f.read() # 具体文件内容
#     poscar_files.append(poscar)
#     print(poscar['filename'], poscar['data'])
#     return response(0, "ok", {"id":poscar['filename']})

from django.http import JsonResponse
import traceback
@require_http_methods("POST")
def uploadPOSCAR(request):
    try:
        f = request.FILES['file']
        body = f.read()  # 具体文件内容
        md5 = hashlib.md5(body).hexdigest()
        typ = f.content_type

        # 查找文件是否已经存在
        file = pymongo.MongoDB.poscar.find_one({"md5": md5})
        if file:
            # 确保返回现有文件的 ID
            return response(0, "File already exists", {"id": str(file['_id'])})

        # 插入一条新的数据
        result = pymongo.MongoDB.poscar.insert_one({
            "md5": md5,
            "type": typ,
            "body": binary.Binary(body)
        })
        # 确保返回新插入文件的 ID
        return response(0, "File uploaded successfully", {"id": str(result.inserted_id)})
    except Exception as e:
        traceback.print_exc()
        return JsonResponse({'error': str(e)}, status=500)



@require_http_methods("POST")
def upload(request):
    param = json.loads(request.body)

    if not param:
        return response(404, "No data provided")

    # 创建材料记录时包括 poscar 文件的 ID
    data = {
        "id": param['id'],
        "name": param['name'],
        "prettyFormula": param['prettyFormula'],
        "elements": param['elements'],
        "bandGap": param['bandGap'],
        "structure": param['structure'],
        "description": param['description'],
        "poscar": param.get('poscar'),  # 这里 'poscar' 应该是文件上传后返回的 ID
        "time": int(time.time())
    }

    pymongo.MongoDB.materials.insert_one(data)
    return response(0, "Material uploaded successfully", {"id": param['id']})

@require_http_methods(["GET"])
def get_poscar(request):
    poscar_id = request.GET.get("id")
    if not poscar_id:
        return JsonResponse({'error': 'Missing POSCAR ID'}, status=400)

    poscar_file = pymongo.MongoDB.poscar.find_one({"_id": ObjectId(poscar_id)})
    if not poscar_file:
        return JsonResponse({'error': 'POSCAR file not found'}, status=404)

    # 假设POSCAR内容保存在`body`字段中
    poscar_content = poscar_file.get('body', '')
    return HttpResponse(poscar_content, content_type='text/plain')
