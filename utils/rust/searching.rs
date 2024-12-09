pub fn binary_search<T: Ord>(arr: &[T], target: &T) -> Option<usize> {
    let mut left = 0;
    let mut right = arr.len();

    while left < right {
        let mid = left + (right - left) / 2;
        match arr[mid].cmp(target) {
            std::cmp::Ordering::Equal => return Some(mid),
            std::cmp::Ordering::Greater => right = mid,
            std::cmp::Ordering::Less => left = mid + 1,
        }
    }

    None
}

pub fn linear_search<T: PartialEq>(arr: &[T], target: &T) -> Option<usize> {
    for (index, item) in arr.iter().enumerate() {
        if item == target {
            return Some(index);
        }
    }
    None
} 