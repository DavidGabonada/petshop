'use client';
import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { Container, Row, Col } from 'react-bootstrap';
import { FaBone } from 'react-icons/fa'; // Import bone icon

export default function Dashboard() {
  const [pets, setPets] = useState([]);
  const [owners, setOwners] = useState([]);
  const [showPetModal, setShowPetModal] = useState(false);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    dateOfBirth: '',
    ownerID: '',
  });
  const [ownerFormData, setOwnerFormData] = useState({
    ownerName: '',
    ownerContactDetails: '',
    ownerAddress: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchPets();
    fetchOwners();
  }, []);

  const fetchPets = () => {
    fetch('http://localhost/petshop/pets.php?action=getPets')
      .then((response) => response.json())
      .then((data) => setPets(data))
      .catch((error) => console.error('Error:', error));
  };

  const fetchOwners = () => {
    fetch('http://localhost/petshop/pets.php?action=getOwners')
      .then((response) => response.json())
      .then((data) => setOwners(data))
      .catch((error) => console.error('Error:', error));
  };

  const handleAddOrEditPet = (e) => {
    e.preventDefault();
    const action = modalType === 'add' ? 'addPet' : 'editPet';

    fetch(`http://localhost/petshop/pets.php?action=${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ ...formData }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          fetchPets();
          setSuccessMessage(`${modalType === 'add' ? 'Added' : 'Edited'} pet successfully!`);
          setShowAlert(true);
          setShowPetModal(false);
          setFormData({
            name: '',
            species: '',
            breed: '',
            dateOfBirth: '',
            ownerID: '',
          });
          setErrorMessage('');
        } else {
          setErrorMessage('Failed to add/edit pet.');
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  const handleAddOwner = (e) => {
    e.preventDefault();

    fetch('http://localhost/petshop/pets.php?action=addOwner', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ ...ownerFormData }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          fetchOwners();
          setSuccessMessage('Owner added successfully!');
          setShowAlert(true);
          setShowOwnerModal(false);
          setOwnerFormData({
            ownerName: '',
            ownerContactDetails: '',
            ownerAddress: '',
          });
        } else {
          setErrorMessage('Failed to add owner.');
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  const openPetModal = () => {
    setModalType('add');
    setShowPetModal(true);
  };

  const openOwnerModal = () => {
    setShowOwnerModal(true);
  };

  return (
    <>
      <Container style={{ marginTop: '2rem', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
        <Row>
          <Col>
            <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#343a40' }}>Pet Clinic Management</h1>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Button variant="primary" onClick={openPetModal} style={{ marginRight: '10px' }}>
                <FaBone style={{ marginRight: '5px' }} /> Add Pet
              </Button>
              <Button variant="secondary" onClick={openOwnerModal}>
                Add Owner
              </Button>
            </div>
            <h2 style={{ textAlign: 'center', marginTop: '20px', color: '#343a40' }}>Pet List</h2>
            <p style={{ textAlign: 'center', marginBottom: '20px', color: '#6c757d' }}>
              Manage all your beloved pets here. Add, edit, or remove pet information easily!
            </p>
            <table className="table table-bordered" style={{ textAlign: 'center' }}>
              <thead className="table-dark">
                <tr>
                  <th>Owner's Name</th>
                  <th>Pet Name</th>
                  <th>Species</th>
                  <th>Breed</th>
                  <th>Date Of Birth</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pets.map((pet) => (
                  <tr key={pet.PetID}>
                    <td>{pet.OwnerName}</td>
                    <td>{pet.PetName}</td>
                    <td>{pet.SpeciesName}</td>
                    <td>{pet.BreedName}</td>
                    <td>{pet.DateOfBirth}</td>
                    <td>
                      <Button variant="warning" onClick={() => {
                        setFormData({
                          name: pet.PetName,
                          species: pet.SpeciesName,
                          breed: pet.BreedName,
                          dateOfBirth: pet.DateOfBirth,
                          ownerID: pet.OwnerID,
                        });
                        setModalType('edit');
                        setShowPetModal(true);
                      }}>
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {showAlert && <Alert variant="success" style={{ marginTop: '20px' }}>{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger" style={{ marginTop: '20px' }}>{errorMessage}</Alert>}
          </Col>
        </Row>

        {/* Pet Modal */}
        <Modal show={showPetModal} onHide={() => setShowPetModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{modalType === 'add' ? 'Add Pet' : 'Edit Pet'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleAddOrEditPet}>
              <Form.Group controlId="formPetName">
                <Form.Label>Pet Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter pet name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formSpecies">
                <Form.Label>Species</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter species"
                  value={formData.species}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formBreed">
                <Form.Label>Breed</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter breed"
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formDateOfBirth">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formOwnerID">
                <Form.Label>Owner ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter owner ID"
                  value={formData.ownerID}
                  onChange={(e) => setFormData({ ...formData, ownerID: e.target.value })}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
                {modalType === 'add' ? 'Add Pet' : 'Edit Pet'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Owner Modal */}
        <Modal show={showOwnerModal} onHide={() => setShowOwnerModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Owner</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleAddOwner}>
              <Form.Group controlId="formOwnerName">
                <Form.Label>Owner Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter owner's name"
                  value={ownerFormData.ownerName}
                  onChange={(e) => setOwnerFormData({ ...ownerFormData, ownerName: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formOwnerContactDetails">
                <Form.Label>Contact Details</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter contact details"
                  value={ownerFormData.ownerContactDetails}
                  onChange={(e) => setOwnerFormData({ ...ownerFormData, ownerContactDetails: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formOwnerAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter address"
                  value={ownerFormData.ownerAddress}
                  onChange={(e) => setOwnerFormData({ ...ownerFormData, ownerAddress: e.target.value })}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
                Add Owner
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
}
