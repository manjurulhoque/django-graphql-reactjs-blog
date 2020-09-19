def normalize_fields(dict_or_list, extra_list):
    """
    helper merge settings defined fields and
    other fields on mutations
    """
    if isinstance(dict_or_list, dict):
        for i in extra_list:
            dict_or_list[i] = "String"
        return dict_or_list
    else:
        return dict_or_list + extra_list
