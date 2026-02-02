package com.carrent.service;

import com.carrent.dto.CarDTO;
import com.carrent.dto.CarRequest;
import com.carrent.dto.FleetDistributionDTO;
import com.carrent.entity.Car;
import com.carrent.entity.User;
import com.carrent.repository.CarRepository;
import com.carrent.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CarService {

    private final CarRepository carRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<CarDTO> browseCars(String type, String brand, String status) {
        List<Car> cars = carRepository.findAll();
        return cars.stream()
                .filter(c -> type == null || c.getType().equalsIgnoreCase(type))
                .filter(c -> brand == null || c.getBrand().equalsIgnoreCase(brand))
                .filter(c -> status == null || c.getStatus().name().equalsIgnoreCase(status))
                .filter(c -> c.getStatus() == Car.CarStatus.AVAILABLE || status != null)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CarDTO getCarById(Long id) {
        Car car = carRepository.findById(id).orElseThrow(() -> new RuntimeException("Car not found"));
        return toDTO(car);
    }

    @Transactional(readOnly = true)
    public List<CarDTO> getCarsByOwner(Long ownerId) {
        return carRepository.findByOwnerId(ownerId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public CarDTO createCar(CarRequest request, Long ownerId) {
        User owner = userRepository.findById(ownerId).orElseThrow(() -> new RuntimeException("Owner not found"));
        Car car = new Car();
        mapRequestToCar(request, car);
        car.setOwner(owner);
        car.setStatus(Car.CarStatus.AVAILABLE);
        return toDTO(carRepository.save(car));
    }

    @Transactional
    public CarDTO updateCar(Long id, CarRequest request, Long ownerId) {
        Car car = carRepository.findById(id).orElseThrow(() -> new RuntimeException("Car not found"));
        if (!car.getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("Not authorized to update this car");
        }
        mapRequestToCar(request, car);
        return toDTO(carRepository.save(car));
    }

    @Transactional
    public void deleteCar(Long id, Long ownerId) {
        Car car = carRepository.findById(id).orElseThrow(() -> new RuntimeException("Car not found"));
        if (!car.getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("Not authorized to delete this car");
        }
        carRepository.delete(car);
    }

    @Transactional(readOnly = true)
    public List<FleetDistributionDTO> getFleetDistribution() {
        return carRepository.countByType().stream()
                .map(row -> new FleetDistributionDTO((String) row[0], (Long) row[1]))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FleetDistributionDTO> getFleetDistributionByOwner(Long ownerId) {
        User owner = userRepository.findById(ownerId).orElseThrow(() -> new RuntimeException("Owner not found"));
        return carRepository.countByTypeForOwner(owner).stream()
                .map(row -> new FleetDistributionDTO((String) row[0], (Long) row[1]))
                .collect(Collectors.toList());
    }

    private void mapRequestToCar(CarRequest request, Car car) {
        car.setModel(request.getModel());
        car.setBrand(request.getBrand());
        car.setType(request.getType().toUpperCase());
        car.setFuelType(request.getFuelType());
        car.setTransmission(request.getTransmission());
        car.setPricePerDay(request.getPricePerDay());
        car.setDescription(request.getDescription());
        car.setImageUrl(request.getImageUrl());
    }

    public CarDTO toDTO(Car car) {
        CarDTO dto = new CarDTO();
        dto.setId(car.getId());
        dto.setModel(car.getModel());
        dto.setBrand(car.getBrand());
        dto.setType(car.getType());
        dto.setFuelType(car.getFuelType());
        dto.setTransmission(car.getTransmission());
        dto.setPricePerDay(car.getPricePerDay());
        dto.setStatus(car.getStatus().name());
        dto.setOwnerId(car.getOwner().getId());
        dto.setOwnerName(car.getOwner().getFullName());
        dto.setDescription(car.getDescription());
        dto.setImageUrl(car.getImageUrl());
        return dto;
    }
}
