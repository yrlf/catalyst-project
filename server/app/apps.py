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



def serialize_material(material):
    # 定义一个帮助函数来处理每个材料的数据转换
    serialized = {
        "_id": str(material["_id"]),  # ObjectId转字符串
        "material_id": material.get("material_id", "N/A"),
        "formula_pretty": material.get("formula_pretty", "N/A"),
        "elements": material.get("elements", "N/A"),
        "band_gap": material.get("band_gap", "N/A"),
        "energy_above_hull": material.get("energy_above_hull", "N/A"),
        # 添加更多字段按需要
    }
    # 如果有复杂类型数据需要特别处理，如日期、自定义对象等
    # serialized['custom_field'] = custom_transform(material['custom_field'])
    return serialized

@require_http_methods(["GET"])
def list_materials(request):
    search_term = request.GET.get('search', '')
    page = int(request.GET.get('page', '1')) - 1
    per_page = int(request.GET.get('per_page', '10'))

    query = {}
    if search_term:
        query = {'formula_pretty': {'$regex': search_term, '$options': 'i'}}

    materials_cursor = db.materials.find(query).skip(page * per_page).limit(per_page)
    materials_list = [serialize_material(material) for material in materials_cursor]  # 使用列表推导来转换每个材料
    total = db.materials.count_documents(query)

    return JsonResponse({
        "status": 200,
        "data": materials_list,
        "total": total,
        "page": page + 1,
        "per_page": per_page
    })



# @require_http_methods(["GET"])
# def list(request):
#     materials = []
#     data = db.materials.find()  # Fetch data from MongoDB
#     for d in data:
#         # Extract only the needed fields and include both _id and material_id
#         material = {
#             '_id': str(d['_id']),  # Convert ObjectId to string for JSON serialization
#             'material_id': d.get('material_id', 'N/A'),  # Treat material_id as a normal feature
#             'formula_pretty': d.get('formula_pretty', 'N/A'),  # Use get to avoid KeyError if the field is missing
#             'band_gap': d.get('band_gap', 'N/A'),  # Provide default values if key does not exist
#             'energy_above_hull': d.get('energy_above_hull', 'N/A')
#         }
#         materials.append(material)
#     return JsonResponse({"status": 0, "message": "ok", "data": materials})


def findDataById(list, id):
    for i in range(len(list)):
        if list[i]['id'] == id:
            return list[i]
    return None

import logging

logger = logging.getLogger(__name__)

def detail(request):
    print("details!")
    material_id = request.GET.get("id", "")
    print("Requested material_id:", material_id)
    logger.debug(f"Requested material_id: {material_id}")
    if not material_id:
        return JsonResponse({'status': 404, 'message': 'Material ID not provided'}, status=404)

    material_data = {}  # Initialize material_data to an empty dictionary

    try:
        # Query using 'material_id' instead of MongoDB '_id'
        material = db.materials.find_one({"material_id": material_id})
        if material is None:
            return JsonResponse({'status': 404, 'message': 'Material not found'}, status=404)

        poscar_id = material.get("poscar")
        poscar_content = ""
        if poscar_id:
            poscar_file = db.poscar.find_one({"_id": ObjectId(poscar_id)})
            if poscar_file:
                if material.get('upload_from_page') == 1:
                    poscar_content = poscar_file.get('body', '').decode('utf-8')
                else:
                    poscar_content = poscar_file.get('body', '')
        material_data = {
            "formula_pretty": material.get('formula_pretty', 'N/A'),
            "elements": material.get('elements', 'N/A'),
            "band_gap": material.get('band_gap', 'N/A'),
            "structure": material.get('structure', 'N/A'),
            "description": material.get('description', 'N/A'),
            "poscarContent": poscar_content,
            "poscarID": poscar_id
        }

        return JsonResponse({'status': 0, 'message': 'ok', 'data': material_data})

    except Exception as e:
        logger.error(f"Error occurred: {str(e)}")
        return JsonResponse({'status': 501, 'message': str(material_data)}, status=501)


poscar_files = []

poscar = {}

from django.http import JsonResponse
import traceback
# @require_http_methods("POST")
# def uploadPOSCAR(request):
#     try:
#         f = request.FILES['file']
#         body = f.read()  # 具体文件内容
#         md5 = hashlib.md5(body).hexdigest()
#         typ = f.content_type

#         # 查找文件是否已经存在
#         file = pymongo.MongoDB.poscar.find_one({"md5": md5})
#         if file:
#             # 确保返回现有文件的 ID
#             return response(0, "File already exists", {"id": str(file['_id'])})

#         # 插入一条新的数据
#         result = pymongo.MongoDB.poscar.insert_one({
#             "md5": md5,
#             "type": typ,
#             "body": body
#         })
#         # 确保返回新插入文件的 ID
#         return response(0, "File uploaded successfully", {"id": str(result.inserted_id)})
#     except Exception as e:
#         traceback.print_exc()
#         return JsonResponse({'error': str(e)}, status=500)



# @require_http_methods("POST")
# def upload(request):
#     param = json.loads(request.body)

#     if not param:
#         return response(404, "No data provided")

#     data = {
#         "material_id": param['material_id'],

#         "formula_pretty": param['formula_pretty'],
#         "elements": param['elements'],
#         "bandGap": param['bandGap'],
#         "structure": param['structure'],
#         "description": param['description'],
#         "poscar": param.get('poscar'),  # 这里 'poscar' 应该是文件上传后返回的 ID
#         "time": int(time.time())
#     }

#     pymongo.MongoDB.materials.insert_one(data)
#     return response(0, "Material uploaded successfully", {"id": param['material_id']})



@require_http_methods("POST")
def uploadPOSCAR(request):
    try:
        f = request.FILES['file']
        body = f.read()  # Actual file content
        md5 = hashlib.md5(body).hexdigest()
        typ = f.content_type

        # Check if the file already exists
        file = pymongo.MongoDB.poscar.find_one({"md5": md5})
        if file:
            # Ensure the existing file's ID is returned
            return response(0, "File already exists", {"id": str(file['_id'])})

        # Insert a new record
        result = pymongo.MongoDB.poscar.insert_one({
            "md5": md5,
            "type": typ,
            "body": body
        })
        # Ensure the new file's ID is returned
        return response(0, "File uploaded successfully", {"id": str(result.inserted_id)})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@require_http_methods("POST")
def upload(request):
    try:
        param = json.loads(request.body)

        if not param:
            return response(404, "No data provided")

        current_time = int(time.time())
        data = {
            "material_id": param['material_id'],
            "formula_pretty": param['formula_pretty'],
            "elements": param['elements'],
            "bandGap": param['bandGap'],
            "structure": param['structure'],
            "description": param['description'],
            "poscar": param.get('poscar'),  # This should be the ID returned after file upload
            "time": current_time,
            'upload_from_page': 1 if param.get('upload_from_page') else 0,
        }

        pymongo.MongoDB.materials.insert_one(data)
        return response(0, "Material uploaded successfully", {"id": param['material_id']})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

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
