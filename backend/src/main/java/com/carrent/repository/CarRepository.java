package com.carrent.repository;

import com.carrent.entity.Car;
import com.carrent.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {

    List<Car> findByOwner(User owner);

    List<Car> findByOwnerId(Long ownerId);

    List<Car> findByStatus(Car.CarStatus status);

    @Query("SELECT c.type, COUNT(c) FROM Car c GROUP BY c.type")
    List<Object[]> countByType();

    @Query("SELECT c.type, COUNT(c) FROM Car c WHERE c.owner = :owner GROUP BY c.type")
    List<Object[]> countByTypeForOwner(User owner);
}
