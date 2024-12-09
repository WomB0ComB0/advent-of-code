use big_o_test::{
    test_algorithm,
    test_crud_algorithms,
    BigOAlgorithmComplexity,
    TimeUnits,
};
use ctor::ctor;

// Initialize single-threaded test environment
#[ctor]
fn init() {
    // Ensure tests run sequentially
    serial_test::serial_executor::init();
}

// Test a simple sorting algorithm
#[test]
fn test_vector_sort() {
    let mut numbers: Vec<i32> = Vec::new();
    
    test_algorithm(
        "Vector sort",                          // test name
        &BigOAlgorithmComplexity::ONLogN,      // expected time complexity
        &BigOAlgorithmComplexity::ON,          // expected space complexity
        TimeUnits::Microseconds,               // time unit for measurements
        // Setup function - creates input data
        |size| {
            numbers = (0..size).rev().collect();
            Ok(())
        },
        // Algorithm to test
        |_size| {
            numbers.sort();
            Ok(())
        },
        // Optional cleanup
        |_size| {
            numbers.clear();
            Ok(())
        },
        40_000_000,  // initial size
        2,           // size multiplier between passes
        2,           // number of passes
    ).unwrap();
}

// Test CRUD operations
#[test]
fn test_vector_crud() {
    let mut vec: Vec<i32> = Vec::new();
    
    test_crud_algorithms(
        "Vec Insert & Remove",
        &BigOAlgorithmComplexity::ON,     // create complexity
        &BigOAlgorithmComplexity::O1,     // read complexity
        &BigOAlgorithmComplexity::O1,     // update complexity
        &BigOAlgorithmComplexity::ON,     // delete complexity
        TimeUnits::Microseconds,
        // Create operation
        |element| {
            vec.push(element as i32);
            Ok(())
        },
        // Read operation
        |element| {
            let _ = vec.get(element as usize);
            Ok(())
        },
        // Update operation
        |element| {
            if let Some(value) = vec.get_mut(element as usize) {
                *value += 1;
            }
            Ok(())
        },
        // Delete operation
        |element| {
            if element < vec.len() {
                vec.remove(element as usize);
            }
            Ok(())
        },
        16_384,     // initial size
        2,          // size multiplier
        2,          // number of passes
        10,         // reads per element
    ).unwrap();
}