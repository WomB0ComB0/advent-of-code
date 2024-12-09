import random
import string
from typing import List, Dict, Callable, Any
import abc


class DataGenerators(abc.ABC):
    @staticmethod
    @abc.abstractmethod
    def int_data_generator(n: int) -> List[int]:
        return [random.randint(0, 1000) for _ in range(n)]

    @staticmethod
    @abc.abstractmethod
    def str_data_generator(n: int) -> List[str]:
        return [string.ascii_lowercase[i % 26] for i in range(n)]

    @staticmethod
    @abc.abstractmethod
    def float_data_generator(n: int) -> List[float]:
        return [random.uniform(0, 1000) for _ in range(n)]

    @staticmethod
    @abc.abstractmethod
    def bool_data_generator(n: int) -> List[bool]:
        return [bool(i % 2) for i in range(n)]

    @staticmethod
    @abc.abstractmethod
    def list_data_generator(n: int) -> List[List[int]]:
        return [[random.randint(0, 1000) for _ in range(5)] for _ in range(n)]

    @staticmethod
    @abc.abstractmethod
    def dict_data_generator(n: int) -> Dict[str, int]:
        return {
            string.ascii_lowercase[i % 26]: random.randint(0, 1000) for i in range(n)
        }

    @staticmethod
    @abc.abstractmethod
    def dict_str_data_generator(n: int) -> Dict[str, str]:
        return {
            string.ascii_lowercase[i % 26]: string.ascii_lowercase[i % 26]
            for i in range(n)
        }

    @staticmethod
    @abc.abstractmethod
    def dict_int_data_generator(n: int) -> Dict[int, int]:
        return {i: random.randint(0, 1000) for i in range(n)}

    @staticmethod
    @abc.abstractmethod
    def dict_str_int_data_generator(n: int) -> Dict[str, int]:
        return {
            string.ascii_lowercase[i % 26]: random.randint(0, 1000) for i in range(n)
        }

    @staticmethod
    @abc.abstractmethod
    def dict_int_str_data_generator(n: int) -> Dict[int, str]:
        return {i: string.ascii_lowercase[i % 26] for i in range(n)}

    @staticmethod
    @abc.abstractmethod
    def dict_str_list_data_generator(n: int) -> Dict[str, List[int]]:
        return {
            string.ascii_lowercase[i % 26]: [random.randint(0, 1000) for _ in range(5)]
            for i in range(n)
        }

    @staticmethod
    @abc.abstractmethod
    def dict_int_list_data_generator(n: int) -> Dict[int, List[int]]:
        return {i: [random.randint(0, 1000) for _ in range(5)] for i in range(n)}

    @staticmethod
    @abc.abstractmethod
    def dict_str_dict_data_generator(n: int) -> Dict[str, Dict[str, int]]:
        return {
            string.ascii_lowercase[i % 26]: {
                string.ascii_lowercase[j % 26]: random.randint(0, 1000)
                for j in range(5)
            }
            for i in range(n)
        }

    @staticmethod
    @abc.abstractmethod
    def dict_int_dict_data_generator(n: int) -> Dict[int, Dict[int, int]]:
        return {i: {j: random.randint(0, 1000) for j in range(5)} for i in range(n)}

    @staticmethod
    @abc.abstractmethod
    def dict_str_float_data_generator(n: int) -> Dict[str, float]:
        return {
            string.ascii_lowercase[i % 26]: random.uniform(0, 1000) for i in range(n)
        }

    @staticmethod
    @abc.abstractmethod
    def dict_int_float_data_generator(n: int) -> Dict[int, float]:
        return {i: random.uniform(0, 1000) for i in range(n)}

    @staticmethod
    @abc.abstractmethod
    def dict_str_bool_data_generator(n: int) -> Dict[str, bool]:
        return {string.ascii_lowercase[i % 26]: bool(i % 2) for i in range(n)}

    @staticmethod
    @abc.abstractmethod
    def dict_int_bool_data_generator(n: int) -> Dict[int, bool]:
        return {i: bool(i % 2) for i in range(n)}

    @staticmethod
    @abc.abstractmethod
    def dict_str_list_str_data_generator(n: int) -> Dict[str, List[str]]:
        return {
            string.ascii_lowercase[i % 26]: [
                string.ascii_lowercase[j % 26] for j in range(5)
            ]
            for i in range(n)
        }

    @staticmethod
    @abc.abstractmethod
    def dict_int_list_int_data_generator(n: int) -> Dict[int, List[int]]:
        return {i: [j for j in range(5)] for i in range(n)}

    @staticmethod
    @abc.abstractmethod
    def dict_str_dict_str_data_generator(n: int) -> Dict[str, Dict[str, str]]:
        return {
            string.ascii_lowercase[i % 26]: {
                string.ascii_lowercase[j % 26]: string.ascii_lowercase[j % 26]
                for j in range(5)
            }
            for i in range(n)
        }

    @staticmethod
    @abc.abstractmethod
    def dict_int_dict_int_data_generator(n: int) -> Dict[int, Dict[int, int]]:
        return {i: {j: j for j in range(5)} for i in range(n)}

    @staticmethod
    @abc.abstractmethod
    def dict_str_dict_int_data_generator(n: int) -> Dict[str, Dict[int, int]]:
        return {
            string.ascii_lowercase[i % 26]: {j: j for j in range(5)} for i in range(n)
        }

    @staticmethod
    @abc.abstractmethod
    def dict_int_dict_str_data_generator(n: int) -> Dict[int, Dict[str, str]]:
        return {
            i: {
                string.ascii_lowercase[j % 26]: string.ascii_lowercase[j % 26]
                for j in range(5)
            }
            for i in range(n)
        }

    @staticmethod
    @abc.abstractmethod
    def dict_str_dict_float_data_generator(n: int) -> Dict[str, Dict[str, float]]:
        return {
            string.ascii_lowercase[i % 26]: {
                string.ascii_lowercase[j % 26]: random.uniform(0, 1000)
                for j in range(5)
            }
            for i in range(n)
        }

    @staticmethod
    @abc.abstractmethod
    def dict_int_dict_float_data_generator(n: int) -> Dict[int, Dict[int, float]]:
        return {i: {j: random.uniform(0, 1000) for j in range(5)} for i in range(n)}

    @staticmethod
    @abc.abstractmethod
    def dict_str_dict_bool_data_generator(n: int) -> Dict[str, Dict[str, bool]]:
        return {
            string.ascii_lowercase[i % 26]: {
                string.ascii_lowercase[j % 26]: bool(j % 2) for j in range(5)
            }
            for i in range(n)
        }

    @staticmethod
    @abc.abstractmethod
    def dict_int_dict_bool_data_generator(n: int) -> Dict[int, Dict[int, bool]]:
        return {i: {j: bool(j % 2) for j in range(5)} for i in range(n)}

    @staticmethod
    @abc.abstractmethod
    def dict_str_dict_list_data_generator(n: int) -> Dict[str, Dict[str, List[int]]]:
        return {
            string.ascii_lowercase[i % 26]: {
                string.ascii_lowercase[j % 26]: [
                    random.randint(0, 1000) for _ in range(5)
                ]
                for j in range(5)
            }
            for i in range(n)
        }

    @staticmethod
    @abc.abstractmethod
    def dict_int_dict_list_data_generator(n: int) -> Dict[int, Dict[int, List[int]]]:
        return {
            i: {j: [random.randint(0, 1000) for _ in range(5)] for j in range(5)}
            for i in range(n)
        }

    @staticmethod
    @abc.abstractmethod
    def dict_str_dict_dict_data_generator(
        n: int,
    ) -> Dict[str, Dict[str, Dict[str, int]]]:
        return {
            string.ascii_lowercase[i % 26]: {
                string.ascii_lowercase[j % 26]: {
                    string.ascii_lowercase[k % 26]: random.randint(0, 1000)
                    for k in range(5)
                }
                for j in range(5)
            }
            for i in range(n)
        }

    @staticmethod
    @abc.abstractmethod
    def dict_int_dict_dict_data_generator(
        n: int,
    ) -> Dict[int, Dict[int, Dict[int, int]]]:
        return {
            i: {j: {k: random.randint(0, 1000) for k in range(5)} for j in range(5)}
            for i in range(n)
        }

    @staticmethod
    @abc.abstractmethod
    def dict_str_dict_dict_str_data_generator(
        n: int,
    ) -> Dict[str, Dict[str, Dict[str, str]]]:
        return {
            string.ascii_lowercase[i % 26]: {
                string.ascii_lowercase[j % 26]: {
                    string.ascii_lowercase[k % 26]: string.ascii_lowercase[k % 26]
                    for k in range(5)
                }
                for j in range(5)
            }
            for i in range(n)
        }

    @staticmethod
    @abc.abstractmethod
    def dict_int_dict_dict_int_data_generator(
        n: int,
    ) -> Dict[int, Dict[int, Dict[int, int]]]:
        return {i: {j: {k: k for k in range(5)} for j in range(5)} for i in range(n)}

    @staticmethod
    @abc.abstractmethod
    def dict_str_dict_dict_float_data_generator(
        n: int,
    ) -> Dict[str, Dict[str, Dict[str, float]]]:
        return {
            string.ascii_lowercase[i % 26]: {
                string.ascii_lowercase[j % 26]: {
                    string.ascii_lowercase[k % 26]: random.uniform(0, 1000)
                    for k in range(5)
                }
                for j in range(5)
            }
            for i in range(n)
        }

    @staticmethod
    @abc.abstractmethod
    def dict_int_dict_dict_float_data_generator(
        n: int,
    ) -> Dict[int, Dict[int, Dict[int, float]]]:
        return {
            i: {j: {k: random.uniform(0, 1000) for k in range(5)} for j in range(5)}
            for i in range(n)
        }

    @staticmethod
    @abc.abstractmethod
    def dict_str_dict_dict_bool_data_generator(
        n: int,
    ) -> Dict[str, Dict[str, Dict[str, bool]]]:
        return {
            string.ascii_lowercase[i % 26]: {
                string.ascii_lowercase[j % 26]: {
                    string.ascii_lowercase[k % 26]: bool(k % 2) for k in range(5)
                }
                for j in range(5)
            }
            for i in range(n)
        }

    @staticmethod
    @abc.abstractmethod
    def dict_int_dict_dict_bool_data_generator(
        n: int,
    ) -> Dict[int, Dict[int, Dict[int, bool]]]:
        return {
            i: {j: {k: bool(k % 2) for k in range(5)} for j in range(5)}
            for i in range(n)
        }

    @staticmethod
    @abc.abstractmethod
    def assign_data_generator(func: Callable) -> Callable:
        def wrapper(n: int) -> Any:
            return func(n)

        return wrapper

    @staticmethod
    @abc.abstractmethod
    def assign_data_generators(funcs: List[Callable]) -> List[Callable]:
        return [DataGenerators.assign_data_generator(func) for func in funcs]
