import React, { useState, useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Text, View, TextInput, SafeAreaView, StyleSheet, ActivityIndicator, ScrollView, Button, TouchableOpacity } from 'react-native';
import store from './store';
import { fetchTodos, addTodo, updateTodo, deleteTodo } from './TodoSlice';

function DataComponent({ onSelectItem }) {
  const { data, loading, error } = useSelector((state) => state.todos);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.dataContainer}>
      {data.slice(0, 20).map((item) => (
        <TouchableOpacity key={item.id} style={styles.dataItem} onPress={() => onSelectItem(item)}>
          <Text style={styles.dataText}>{item.id}: {item.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function App() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAdd = () => {
    if (inputValue.trim() === "") {
      alert("Please enter a valid title");
      return;
    }
    dispatch(addTodo(inputValue));
    setInputValue('');
  };

  const handleUpdate = () => {
    if (!selectedItem) {
      alert("Please select an item to update");
      return;
    }
    if (inputValue.trim() === "") {
      alert("Please enter a valid title");
      return;
    }
    dispatch(updateTodo({ id: selectedItem.id, title: inputValue }));
    setInputValue('');
    setSelectedItem(null);
  };

  const handleDelete = () => {
    if (!selectedItem) {
      alert("Please select an item to delete");
      return;
    }
    dispatch(deleteTodo(selectedItem.id));
    setSelectedItem(null);
    setInputValue('');
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setInputValue(item.title);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Todo List App</Text>

      <TextInput 
        value={inputValue}
        onChangeText={setInputValue}
        placeholder="Enter a todo item"
        style={styles.input}
      />
      
      <View style={styles.buttonContainer}>
        <Button title="Add" onPress={handleAdd} />
        <Button title="Update" onPress={handleUpdate} />
        <Button title="Delete" onPress={handleDelete} />
      </View>

      <DataComponent onSelectItem={handleSelectItem} />
    </SafeAreaView>
  );
}

export default function Main() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 16,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  dataContainer: {
    padding: 10,
  },
  dataItem: {
    backgroundColor: '#2196F3',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  dataText: {
    fontSize: 18,
    color: '#FFF',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
