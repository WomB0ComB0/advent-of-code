pub fn bubble_sort<T: Ord>(arr: &mut [T]) {
    let len = arr.len();
    for i in 0..len {
        for j in 0..len - 1 - i {
            if arr[j] > arr[j + 1] {
                arr.swap(j, j + 1);
            }
        }
    }
}

pub fn quick_sort<T: Ord>(arr: &mut [T]) {
    let len = arr.len();
    if len <= 1 {
        return;
    }

    let pivot = partition(arr);
    quick_sort(&mut arr[0..pivot]);
    quick_sort(&mut arr[pivot + 1..]);
}

fn partition<T: Ord>(arr: &mut [T]) -> usize {
    let len = arr.len();
    let pivot = len - 1;
    let mut i = 0;
    
    for j in 0..len - 1 {
        if arr[j] <= arr[pivot] {
            arr.swap(i, j);
            i += 1;
        }
    }
    
    arr.swap(i, pivot);
    i
} 