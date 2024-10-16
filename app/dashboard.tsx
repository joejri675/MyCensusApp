import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  Button,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addPerson, getPersons, updatePerson, deletePerson, initializeDB, Person } from "@/database"; 

const Dashboard = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [llg, setLlg] = useState("");
  const [ward, setWard] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("Select Gender");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [persons, setPersons] = useState<Person[]>([]);
  const [editingPersonId, setEditingPersonId] = useState<number | null>(null);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const fetchPersons = async () => {
    const allPersons = await getPersons();
    setPersons(allPersons);
  };

  useEffect(() => {
    const setupDatabase = async () => {
      await initializeDB();
      fetchPersons();
    };

    setupDatabase();
  }, []);

  const handleSubmit = async () => {
    if (!firstName || !lastName || !province || gender === "Select Gender") {
      Alert.alert("Error", "Please fill in all fields correctly.");
      return;
    }

    try {
      if (editingPersonId) {
        await updatePerson(editingPersonId, firstName, lastName, phone, email, province, date.toISOString(), gender);
        console.log("Person updated successfully");
      } else {
        const id = await addPerson(firstName, lastName, phone, email, province, date.toISOString(), gender);
        console.log("Person created successfully with ID:", id);
      }
      resetForm();
      fetchPersons();
    } catch (error) {
      console.error("Error submitting person:", error);
    }
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setProvince("");
    setDistrict("");
    setLlg("");
    setWard("");
    setGender("Select Gender");
    setDate(new Date());
    setEditingPersonId(null);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Census Data Entry Header */}
        <Text style={styles.header}>Census Data Entry</Text>

        {/* Province, District, LLG, Ward Inputs */}
        <TextInput
          style={styles.input}
          placeholder="Province"
          value={province}
          onChangeText={setProvince}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="District"
          value={district}
          onChangeText={setDistrict}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Local Level Government (LLG)"
          value={llg}
          onChangeText={setLlg}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Ward"
          value={ward}
          onChangeText={setWard}
          placeholderTextColor="#888"
        />

        {/* Household Info Section */}
        <Text style={styles.subHeader}>Household Info</Text>
        <TextInput
          style={styles.input}
          placeholder="Total Number of People"
          keyboardType="numeric"
          placeholderTextColor="#888"
        />

        {/* Individual Member Information Section */}
        <Text style={styles.subHeader}>Individual Member Information</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={firstName}
          onChangeText={setFirstName}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Relationship to Head of Household"
          value={lastName}
          onChangeText={setLastName}
          placeholderTextColor="#888"
        />
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
          <Picker.Item label="Other" value="other" />
        </Picker>

        <View>
          <Button
            title="Select Date of Birth"
            onPress={() => setShowDatePicker(true)}
          />
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}
          <Text style={styles.dateText}>
            Date of Birth: {date.toDateString()}
          </Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Citizenship"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#888"
        />

        <Button title={editingPersonId ? "Update" : "Submit"} onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

// Styling for a clean, readable layout
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  dateText: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    color: "#666",
  },
});

export default Dashboard;
